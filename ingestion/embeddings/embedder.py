from sentence_transformers import SentenceTransformer

# Load the model down here so it isn't instantiated immediately upon import if not needed
model = None

def get_model():
    global model
    if model is None:
        model = SentenceTransformer('all-MiniLM-L6-v2')
    return model

def create_embeddings(chunks: list[str]) -> list[list[float]]:
    """Generates embeddings for a list of text chunks."""
    model_instance = get_model()
    embeddings = model_instance.encode(chunks)
    return embeddings.tolist()
