import os
import tempfile
from git import GitCommandError, Repo

ALLOWED_EXTENSIONS = {
    ".py", ".js", ".ts", ".java", ".cpp", ".c",
    ".md", ".txt", ".json", ".yaml", ".yml", ".tsx", ".jsx", ".html", ".css"
}

ALLOWED_BASENAMES = {
    "README",
    "README.md",
    "README.txt",
    "LICENSE",
    "CHANGELOG",
    "Makefile",
}

IGNORE_DIRS = {
    ".git",
    "node_modules",
    "venv",
    ".venv",
    "__pycache__",
    "dist",
    "build",
    ".next"
}


def load_github_repo(repo_url: str) -> list[dict]:
    """Clones a GitHub repo and extracts text from valid files."""
    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            Repo.clone_from(repo_url, temp_dir)
        except GitCommandError as error:
            raise ValueError(f"Failed to clone repository {repo_url}: {error}") from error

        documents: list[dict] = []

        for root, dirs, files in os.walk(temp_dir):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            for file in files:
                ext = os.path.splitext(file)[1]
                if ext not in ALLOWED_EXTENSIONS and file not in ALLOWED_BASENAMES:
                    continue

                path = os.path.join(root, file)

                try:
                    with open(path, "r", encoding="utf-8") as f:
                        text = f.read().strip()
                        if not text:
                            continue
                        rel_path = os.path.relpath(path, temp_dir)
                        documents.append({
                            "text": text,
                            "file_path": rel_path,
                        })
                except (UnicodeDecodeError, OSError):
                    continue

        return documents
