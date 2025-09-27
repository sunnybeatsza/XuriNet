# A RegEx, or Regular Expression, is a sequence of characters that forms a search pattern.
# RegEx can be used to check if a string contains the specified search pattern.
import re

pdf_as_text = "zurinet-server/sampleDataSet/Gauteng_Alexandra_extracted.txt"

with open(pdf_as_text, 'r', encoding='utf-8') as file:
    text = file.read()


# Regex pattern 1
pattern = r'(lived.*)'
matches = re.findall(pattern, text, re.IGNORECASE)


extracted_text = "\n".join(matches)

output_file = "extracted_regex.txt"
with open(output_file, "w", encoding="utf-8") as file:
    file.write(extracted_text)


print(f"Extraction complete.")