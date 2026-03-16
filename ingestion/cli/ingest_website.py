import argparse
import json
import os
import sys

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
INGESTION_ROOT = os.path.dirname(CURRENT_DIR)
sys.path.append(INGESTION_ROOT)

from pipeline.website_ingestion_pipeline import process_website


def main() -> int:
    parser = argparse.ArgumentParser(description="Ingest a website into Qdrant")
    parser.add_argument("url")
    parser.add_argument("--source-id", required=True)
    parser.add_argument("--user-id", required=True)
    parser.add_argument("--file-name")
    args = parser.parse_args()

    try:
        result = process_website(
            args.url,
            source_id=args.source_id,
            user_id=args.user_id,
            file_name=args.file_name,
        )
        print(json.dumps({"success": True, "result": result}))
        return 0
    except Exception as exc:
        print(json.dumps({"success": False, "error": str(exc)}))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())