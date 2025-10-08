import os
import glob
import time
from google import genai
from google.genai import types
from dotenv import load_dotenv
from tqdm import tqdm

from extract_PDF import extract_pdf_data, get_output_txt_path

load_dotenv()
client = genai.Client(api_key=os.getenv("Gemini_API_Key"))

sample_data_folder = "./xurinet-server/sampleDataSet"
summary_output_folder = "./xurinet-server/summaries"
os.makedirs(summary_output_folder, exist_ok=True)

pdf_files = glob.glob(os.path.join(sample_data_folder, "*.pdf"))

print(f"Starting processing of {len(pdf_files)} PDF(s)...\n")

start_time = time.time()

def live_timer(start):
    elapsed = int(time.time() - start)
    mins, secs = divmod(elapsed, 60)
    print(f"\r⏱️ Elapsed time: {mins:02d}:{secs:02d}", end="", flush=True)

for idx, pdf_file in enumerate(tqdm(pdf_files, desc="Processing PDFs"), start=1):
    print(f"\n📄 [{idx}/{len(pdf_files)}] Processing document: {pdf_file}")

    # 1. Try Gemini OCR extraction first
    prompt = "Extract all text from this document"
    with open(pdf_file, "rb") as f:
        pdf_bytes = f.read()

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                types.Part.from_bytes(
                    data=pdf_bytes,
                    mime_type='application/pdf',
                ),
                prompt
            ]
        )

        if response and response.text and response.text.strip():
            print("✅ Gemini OCR extraction successful!")
            extracted_text = response.text.strip()
        else:
            print("⚠️ Gemini OCR returned no text or empty response.")
            extracted_text = ""

    except Exception as e:
        print(f"❌ Gemini OCR failed for {pdf_file}: {e}")
        extracted_text = ""

    # If Gemini OCR failed, use manual extraction (in memory)
    if not extracted_text:
        print("🔧 Using manual extraction...")
        manual_text = extract_pdf_data(pdf_file)
        if manual_text.strip():
            summary_prompt = f"Summarize this document:\n{manual_text}"
            try:
                summary_response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=[summary_prompt]
                )
                if summary_response and summary_response.text and summary_response.text.strip():
                    print(f"📝 Summary for {pdf_file} (manual extraction):")
                    print(summary_response.text)
                    base = os.path.splitext(os.path.basename(pdf_file))[0]
                    summary_path = os.path.join(summary_output_folder, base + "_summary.txt")
                    with open(summary_path, "w", encoding="utf-8") as f:
                        f.write(summary_response.text)
                    print(f"💾 Summary saved: {summary_path}")
                    print("📌 Document processing complete!\n")
                else:
                    print(f"⚠️ Gemini summarization returned empty response for {pdf_file}.")
                    print("⏭ Moving to next document.\n")
            except Exception as e:
                print(f"❌ Gemini summarization failed for {pdf_file}: {e}")
                print("⏭ Moving to next document.\n")
        else:
            print(f"❌ No text could be extracted from {pdf_file}.")
            print("⏭ Moving to next document.\n")

    else:
        summary_prompt = f"Summarize this document:\n{extracted_text}"
        try:
            summary_response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[summary_prompt]
            )
            if summary_response and summary_response.text and summary_response.text.strip():
                print(f"📝 Summary for {pdf_file} (Gemini OCR extraction):")
                base = os.path.splitext(os.path.basename(pdf_file))[0]
                summary_path = os.path.join(summary_output_folder, base + "_summary.txt")
                with open(summary_path, "w", encoding="utf-8") as f:
                    f.write(summary_response.text)
                print(f"💾 Summary saved: {summary_path}")
                print("📌 Document processing complete!\n")
            else:
                print(f"⚠️ Gemini summarization returned empty response for {pdf_file}.")
                print("⏭ Moving to next document.\n")
        except Exception as e:
            print(f"❌ Gemini summarization failed for {pdf_file}: {e}")
            print("⏭ Moving to next document.\n")

    # Live timer and delay for rate limiting
    print("⏳ Waiting 60 seconds for rate limit...")
    wait_start = time.time()
    while time.time() - wait_start < 60:
        live_timer(start_time)
        time.sleep(1)
    print()  # Newline after timer

elapsed_time = time.time() - start_time
mins, secs = divmod(int(elapsed_time), 60)
print(f"\n🎉 All documents processed! Total time: {mins:02d}:{secs:02d}")
