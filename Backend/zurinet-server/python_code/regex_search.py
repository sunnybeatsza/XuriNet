# A RegEx, or Regular Expression, is a sequence of characters that forms a search pattern.

# RegEx can be used to check if a string contains the specified search pattern.

import re

extracted_text_data = "zurinet-server/sampleDataSet/Gauteng_Alexandra_extracted.txt"

with open(extracted_text_data, 'r', encoding='utf-8') as f:
    text = f.read()

victim_name = re.findall(r'complainant,\s*([A\[\]\.\.\.]+)', text)
aggressor = re.findall(r'([A-Z]+,\s*[A-Z][a-z]+)\s+Appellant', text)
court_location = re.findall(r'IN THE HIGH COURT OF SOUTH AFRICA\s*\n([A-Z\s,]+)', text)
victim_location = re.findall(r'lived with her mother in ([A-Za-z]+)', text)
dates = re.findall(r'(\d{1,2} [A-Za-z]+ \d{4}|[A-Za-z]+ \d{4})', text)
victim_age = re.findall(r'(\d{1,2}) year old', text)

print("Victim Name:", victim_name)
print("Aggressor:", aggressor)
print("Court Location:", court_location)
print("Victim Location:", victim_location)
print("Dates:", dates)
print("Victim Age:", victim_age)


