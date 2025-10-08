import os
import glob
from google import genai
from google.genai import types
from dotenv import load_dotenv

from extract_PDF import extract_pdf_data, get_output_txt_path

load_dotenv()
client = genai.Client(api_key=os.getenv("Gemini_API_Key"))

sample_data_folder = "./xurinet-server/sampleDataSet"
pdf_files = glob.glob(os.path.join(sample_data_folder, "*.pdf"))

print(f"Starting processing of {len(pdf_files)} PDF(s)...\n")

for idx, pdf_file in enumerate(pdf_files, start=1):
    print(f"📄 [{idx}/{len(pdf_files)}] Processing document: {pdf_file}")

    # 1. Try Gemini OCR extraction first
    prompt = "Extract all text from this document"
    with open(pdf_file, "rb") as f:
        pdf_bytes = f.read()

    try:
        response = client.models.generate_content(
            model="gemini-2.5-pro",
            contents=[
                types.Part.from_bytes(
                    data=pdf_bytes,
                    mime_type='application/pdf',
                ),
                prompt
            ]
        )

        # Check Gemini OCR response
        if response and response.text and response.text.strip():
            print("✅ Gemini OCR extraction successful!")
            extracted_text = response.text.strip()
        else:
            print("⚠️ Gemini OCR returned no text or empty response.")
            extracted_text = ""

    except Exception as e:
        print(f"❌ Gemini OCR failed for {pdf_file}: {e}")
        extracted_text = ""

    # If Gemini OCR failed, use manual extraction
    if not extracted_text:
        print("🔧 Using manual extraction...")
        manual_text = extract_pdf_data(pdf_file)
        output_txt_file = get_output_txt_path(pdf_file)
        with open(output_txt_file, "w", encoding="utf-8") as f:
            f.write(manual_text)
        print(f"💾 Manual extraction done: {pdf_file} -> {output_txt_file}")

        if manual_text.strip():
            summary_prompt = f"Summarize this document:\n{manual_text}"
            try:
                summary_response = client.models.generate_content(
                    model="gemini-2.5-pro",
                    contents=[summary_prompt]
                )
                # Check summary response
                if summary_response and summary_response.text and summary_response.text.strip():
                    print(f"📝 Summary for {pdf_file} (manual extraction):")
                    print(summary_response.text)
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
        # Summarize extracted text from Gemini OCR
        summary_prompt = f"Summarize this document:\n{extracted_text}"
        try:
            summary_response = client.models.generate_content(
                model="gemini-2.5-pro",
                contents=[summary_prompt]
            )
            if summary_response and summary_response.text and summary_response.text.strip():
                print(f"📝 Summary for {pdf_file} (Gemini OCR extraction):")
                print(summary_response.text)
                print("📌 Document processing complete!\n")
            else:
                print(f"⚠️ Gemini summarization returned empty response for {pdf_file}.")
                print("⏭ Moving to next document.\n")
        except Exception as e:
            print(f"❌ Gemini summarization failed for {pdf_file}: {e}")
            print("⏭ Moving to next document.\n")

print("🎉 All documents processed!")
