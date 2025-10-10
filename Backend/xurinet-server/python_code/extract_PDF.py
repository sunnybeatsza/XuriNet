import pdfplumber
import pytesseract
from pdf2image import convert_from_path
import glob
import os
from regex_search import extract_locations  # Your regex rules

sample_data_folder = "./xurinet-server/sampleDataSet"
output_folder = "./xurinet-server/extracted_txt"

# Ensure the output folder exists
os.makedirs(output_folder, exist_ok=True)

pdf_files = glob.glob(os.path.join(sample_data_folder, "*.pdf"))

def get_output_txt_path(pdf_path):
    base = os.path.splitext(os.path.basename(pdf_path))[0]
    return os.path.join(output_folder, base + "_extracted.txt")

def extract_pdf_data(pdf_file):
    text = []

    with pdfplumber.open(pdf_file) as pdf:
        for i, page in enumerate(pdf.pages):
            page_text = page.extract_text()
            if page_text:
                text.append(page_text + "\n\n")
    return "".join(text)

for pdf_file in pdf_files:
    full_text = extract_pdf_data(pdf_file)
    
    output_txt_file = get_output_txt_path(pdf_file)
    with open(output_txt_file, "w", encoding="utf-8") as f:
        f.write(full_text)
    print(f"Extracted: {pdf_file} -> {output_txt_file}")


