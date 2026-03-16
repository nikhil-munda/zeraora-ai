import os
import subprocess
import tempfile
from urllib.parse import urlparse

from langchain_community.document_loaders import GithubFileLoader
from langchain_core.documents import Document

ALLOWED_EXTENSIONS = {
    ".py",
    ".ts",
    ".js",
    ".md",
    ".txt",
    ".json",
    ".yaml",
    ".yml",
}

IGNORE_DIRS = {
    ".git",
    "node_modules",
    "venv",
    ".venv",
    "dist",
    "build",
    "__pycache__",
}


def _parse_repo_identifier(repo_url: str) -> str:
    parsed = urlparse(repo_url)
    if parsed.scheme not in {"http", "https"}:
        raise ValueError("Repository URL must start with http:// or https://")
    if parsed.netloc != "github.com":
        raise ValueError("Only github.com repository URLs are supported")

    parts = [part for part in parsed.path.strip("/").split("/") if part]
    if len(parts) < 2:
        raise ValueError("Repository URL must be in format https://github.com/owner/repo")

    owner = parts[0]
    repo_name = parts[1]
    if repo_name.endswith(".git"):
        repo_name = repo_name[:-4]

    return f"{owner}/{repo_name}"


def _is_allowed_file(file_path: str) -> bool:
    normalized_path = file_path.replace("\\", "/")
    parts = [part for part in normalized_path.split("/") if part]
    if any(part in IGNORE_DIRS for part in parts):
        return False

    extension = os.path.splitext(normalized_path)[1].lower()
    return extension in ALLOWED_EXTENSIONS


def _build_loader(repo_identifier: str, branch: str | None, access_token: str | None) -> GithubFileLoader:
    loader_kwargs: dict = {
        "repo": repo_identifier,
        "github_api_url": "https://api.github.com",
        "file_filter": _is_allowed_file,
    }
    if access_token:
        loader_kwargs["access_token"] = access_token
    if branch:
        loader_kwargs["branch"] = branch

    return GithubFileLoader(**loader_kwargs)


def _load_via_git_clone(repo_url: str, max_files: int) -> list[Document]:
    documents: list[Document] = []
    with tempfile.TemporaryDirectory() as temp_dir:
        clone_result = subprocess.run(
            ["git", "clone", "--depth", "1", repo_url, temp_dir],
            capture_output=True,
            text=True,
            check=False,
        )
        if clone_result.returncode != 0:
            raise ValueError(
                f"Failed to clone repository {repo_url}: {clone_result.stderr.strip() or clone_result.stdout.strip()}"
            )

        for root, dirs, files in os.walk(temp_dir):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            for file_name in files:
                path = os.path.join(root, file_name)
                rel_path = os.path.relpath(path, temp_dir).replace("\\", "/")
                if not _is_allowed_file(rel_path):
                    continue

                try:
                    with open(path, "r", encoding="utf-8") as f:
                        content = f.read().strip()
                except (UnicodeDecodeError, OSError):
                    continue

                if not content:
                    continue

                documents.append(
                    Document(
                        page_content=content,
                        metadata={
                            "path": rel_path,
                            "source": f"{repo_url.rstrip('/')}/blob/main/{rel_path}",
                        },
                    )
                )
                if len(documents) >= max_files:
                    return documents

    return documents


def load_github_repo_documents(
    repo_url: str,
    *,
    branch: str | None = None,
    max_files: int = 1000,
) -> list[Document]:
    """Load allowed files from a GitHub repository as LangChain Documents."""
    repo_identifier = _parse_repo_identifier(repo_url)
    access_token = os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN") or os.getenv("GITHUB_ACCESS_TOKEN")

    if not access_token:
        return _load_via_git_clone(repo_url, max_files)

    branch_candidates = []
    if branch:
        branch_candidates.append(branch)
    env_branch = os.getenv("GITHUB_REPO_BRANCH")
    if env_branch:
        branch_candidates.append(env_branch)
    branch_candidates.extend(["main", "master", None])

    seen = set()
    unique_branches: list[str | None] = []
    for candidate in branch_candidates:
        if candidate in seen:
            continue
        seen.add(candidate)
        unique_branches.append(candidate)

    documents: list[Document] = []
    last_error: Exception | None = None

    for candidate in unique_branches:
        try:
            loader = _build_loader(repo_identifier, candidate, access_token)
            documents = loader.load()
            break
        except Exception as error:
            last_error = error
            continue

    if not documents and last_error is not None:
        raise ValueError(f"Failed to load repository {repo_url}: {last_error}") from last_error

    if len(documents) > max_files:
        documents = documents[:max_files]

    return documents
