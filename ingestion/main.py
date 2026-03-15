import os
from pipeline.pdf_ingestion_pipeline import process_pdf

if __name__ == "__main__":
    sample_pdf_path = "uploads/sample.pdf"
    
    if not os.path.exists(sample_pdf_path):
        print(f"Sample PDF not found at {sample_pdf_path}.")
        print("Please place a sample pdf at 'uploads/sample.pdf' to proceed.")
        print("You can create the uploads folder if it doesn't exist.")
    else:
        result = process_pdf(
            sample_pdf_path,
            source_id="sample-source",
            user_id="sample-user",
            file_name=os.path.basename(sample_pdf_path),
        )
        print(result)
