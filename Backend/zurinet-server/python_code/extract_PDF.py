import pdfplumber
import pytesseract
from pdf2image import convert_from_path
import glob
import os
from regex_search import extract_locations  # Your regex rules

sample_data_folder = "./zurinet-server/sampleDataSet"
pdf_files = glob.glob(os.path.join(sample_data_folder, "*.pdf"))

def get_output_txt_path(pdf_path):
    base, _ = os.path.splitext(pdf_path)
    return base + "_extracted.txt"

def extract_pdf_data(pdf_file):
    text = []

    with pdfplumber.open(pdf_file) as pdf:
        for i, page in enumerate(pdf.pages):
            page_text = page.extract_text()
            if page_text:
                # Normal (digital) text extraction
                text.append(page_text + "\n\n")
            else:
                # OCR fallback for scanned pages
                print(f"OCR needed for page {i+1} in {pdf_file}")
                images = convert_from_path(pdf_file, first_page=i+1, last_page=i+1)
                ocr_text = pytesseract.image_to_string(images[0])
                text.append(ocr_text + "\n\n")

    return "".join(text)

for pdf_file in pdf_files:
    full_text = extract_pdf_data(pdf_file)
    extracted_locations = extract_locations(full_text)
    output_txt_file = get_output_txt_path(pdf_file)
    with open(output_txt_file, "w", encoding="utf-8") as f:
        f.write(extracted_locations)
    print(f"Extracted: {pdf_file} -> {output_txt_file}")
