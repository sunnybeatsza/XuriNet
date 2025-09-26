import pdfplumber

sample_pdf_file = "./zurinet-server/sampleDataSet/Gauteng_Alexandra.pdf"
output_txt_file = "./zurinet-server/sampleDataSet/Gauteng_Alexandra_extracted.txt"

def extract_pdf_data(pdf_file):
    with pdfplumber.open(pdf_file) as pdf:
        text = []
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text.append(page_text + "\n" + "\n")
    return text


result = extract_pdf_data(sample_pdf_file)


# Write extracted text to a .txt file
with open(output_txt_file, "w", encoding="utf-8") as f:
    f.writelines(result)

