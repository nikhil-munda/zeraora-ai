import requests
from bs4 import BeautifulSoup


DEFAULT_HEADERS = {
    "User-Agent": "ZeraoraAI/1.0 (+https://github.com/nikhil-munda/zeraora-ai)"
}


def load_website(url: str) -> str:
    """Fetch a web page and return normalized readable text."""
    try:
        response = requests.get(url, headers=DEFAULT_HEADERS, timeout=15)
        response.raise_for_status()
    except requests.RequestException as error:
        raise ValueError(f"Failed to fetch {url}: {error}") from error

    soup = BeautifulSoup(response.text, "html.parser")

    for element in soup([
        "script",
        "style",
        "noscript",
        "nav",
        "header",
        "footer",
        "aside",
        "svg",
        "form",
    ]):
        element.decompose()

    text = soup.get_text(separator=" ")
    cleaned_text = " ".join(text.split())

    if not cleaned_text:
        raise ValueError(f"No readable text found at {url}")

    return cleaned_text
