import os
import glob
import time
import sys
from google import genai
from google.genai import types
from dotenv import load_dotenv
from tqdm import tqdm

from extract_PDF import extract_pdf_data

# --- Configuration ---
load_dotenv()
API_KEY = os.getenv("Gemini_API_Key")
client = genai.Client(api_key=API_KEY)

SAMPLE_DATA_FOLDER = "./xurinet-server/sampleDataSet"
SUMMARY_OUTPUT_FOLDER = "./xurinet-server/summaries"
RATE_LIMIT_SECONDS = 60

os.makedirs(SUMMARY_OUTPUT_FOLDER, exist_ok=True)

# --- Utility Functions ---
def get_pdf_files(folder):
    dataset_folders = [
        os.path.join(folder, d)
        for d in os.listdir(folder)
        if os.path.isdir(os.path.join(folder, d))
    ]
    pdf_files = []
    for subfolder in dataset_folders:
        pdf_files.extend(glob.glob(os.path.join(subfolder, "*.pdf")))
    return pdf_files

def live_timer(start):
    elapsed = int(time.time() - start)
    mins, secs = divmod(elapsed, 60)
    print(f"\r⏱️ Elapsed time: {mins:02d}:{secs:02d}", end="", flush=True)

def gemini_ocr_extract(pdf_file):
    prompt = "Extract all text from this document"
    with open(pdf_file, "rb") as f:
        pdf_bytes = f.read()
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                types.Part.from_bytes(data=pdf_bytes, mime_type='application/pdf'),
                prompt
            ]
        )
        if response and response.text and response.text.strip():
            return response.text.strip()
    except Exception as e:
        print(f"❌ Gemini OCR failed for {pdf_file}: {e}")
    return ""

def gemini_summarize(text):
    summary_prompt = f"Summarize this document:\n{text}"
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[summary_prompt]
        )
        if response and response.text and response.text.strip():
            return response.text.strip()
    except Exception as e:
        print(f"❌ Gemini summarization failed: {e}")
    return ""

def save_summary(pdf_file, summary_text):
    base = os.path.splitext(os.path.basename(pdf_file))[0]
    summary_path = os.path.join(SUMMARY_OUTPUT_FOLDER, base + "_summary.txt")
    with open(summary_path, "w", encoding="utf-8") as f:
        f.write(summary_text)
    print(f"💾 Summary saved: {summary_path}")

def process_pdf(pdf_file):
    print(f"\n📄 Processing document: {pdf_file}")
    extracted_text = gemini_ocr_extract(pdf_file)
    if not extracted_text:
        print("🔧 Using manual extraction...")
        extracted_text = extract_pdf_data(pdf_file)
        if not extracted_text.strip():
            print(f"❌ No text could be extracted from {pdf_file}.")
            return
    summary_text = gemini_summarize(extracted_text)
    if summary_text:
        print(f"📝 Summary for {pdf_file}:")
        save_summary(pdf_file, summary_text)
        print("📌 Document processing complete!\n")
    else:
        print(f"⚠️ Gemini summarization returned empty response for {pdf_file}.")

def process_pdf_and_return(pdf_file):
    extracted_text = gemini_ocr_extract(pdf_file)
    if not extracted_text:
        extracted_text = extract_pdf_data(pdf_file)
        if not extracted_text.strip():
            print(f"No text could be extracted from {pdf_file}.", file=sys.stderr)
            return
    summary_text = gemini_summarize(extracted_text)
    if summary_text:
        print(summary_text)
    else:
        print("Gemini summarization returned empty response.", file=sys.stderr)

def main():
    pdf_files = get_pdf_files(SAMPLE_DATA_FOLDER)
    estimated_total_seconds = len(pdf_files) * RATE_LIMIT_SECONDS
    estimated_mins, estimated_secs = divmod(estimated_total_seconds, 60)
    print(f"Starting processing of {len(pdf_files)} PDF(s)...\n")
    print(f"Estimated time to completion: {estimated_mins:02d}:{estimated_secs:02d} (at {RATE_LIMIT_SECONDS}s per file)\n")
    start_time = time.time()

    for idx, pdf_file in enumerate(tqdm(pdf_files, desc="Processing PDFs"), start=1):
        process_pdf(pdf_file)
        print("⏳ Waiting 60 seconds for rate limit...")
        wait_start = time.time()
        while time.time() - wait_start < RATE_LIMIT_SECONDS:
            live_timer(start_time)
            time.sleep(1)
        print()  # Newline after timer

    elapsed_time = time.time() - start_time
    mins, secs = divmod(int(elapsed_time), 60)
    print(f"\n🎉 All documents processed! Total time: {mins:02d}:{secs:02d}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
        process_pdf_and_return(pdf_path)
    else:
        main()
