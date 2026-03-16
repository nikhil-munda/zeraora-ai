import os
from pipeline.pdf_ingestion_pipeline import process_pdf
from pipeline.website_ingestion_pipeline import process_website
from pipeline.github_ingestion_pipeline import process_github_repo

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
        print("PDF processing result:", result)

    print("\n--- Website Ingestion Test ---")
    website_result = process_website(
        "https://docs.python.org/3/tutorial/",
        source_id="sample-website-source",
        user_id="sample-user",
        file_name="https://docs.python.org/3/tutorial/",
    )
    print("Website processing result:", website_result)

    print("\n--- GitHub Ingestion Test ---")
    github_result = process_github_repo(
        "https://github.com/langchain-ai/langchain",
        source_id="sample-github-source",
        user_id="sample-user"
    )
    print("GitHub processing result:", github_result)
