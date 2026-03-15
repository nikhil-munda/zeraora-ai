import argparse
import json
import os
import sys

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
INGESTION_ROOT = os.path.dirname(CURRENT_DIR)
sys.path.append(INGESTION_ROOT)

from embeddings.embedder import create_embeddings
from vector.qdrant_client import search_vectors


def main() -> int:
    parser = argparse.ArgumentParser(description="Retrieve relevant chunks from Qdrant")
    parser.add_argument("query")
    parser.add_argument("--user-id", required=True)
    parser.add_argument("--limit", type=int, default=5)
    args = parser.parse_args()

    try:
        query_embedding = create_embeddings([args.query])[0]
        matches = search_vectors(query_embedding, user_id=args.user_id, limit=args.limit)
        print(json.dumps({"success": True, "matches": matches}))
        return 0
    except Exception as exc:
        print(json.dumps({"success": False, "error": str(exc)}))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())