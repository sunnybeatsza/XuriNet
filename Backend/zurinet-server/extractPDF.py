import pdfplumber

sample_pdf_file = "./zurinet-server/sampleDataSet/Gauteng_Alexandra.pdf"

def extract_pdf_data(pdf_file):
    with pdfplumber.open(pdf_file) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
    return text


result = extract_pdf_data(sample_pdf_file)
print(result)

