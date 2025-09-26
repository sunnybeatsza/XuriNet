import pdfplumber

with pdfplumber.open("./zurinet-server/sampleDataSet/Gauteng_Alexandra.pdf") as pdf:
    text = ""
    for page in pdf.pages:
        text += page.extract_text()
    print(text)