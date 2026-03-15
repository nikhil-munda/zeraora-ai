from langchain_text_splitters import RecursiveCharacterTextSplitter

def split_text(text: str) -> list[str]:
    """Splits text into chunks of size 500 with overlap 50."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        length_function=len
    )
    return splitter.split_text(text)
