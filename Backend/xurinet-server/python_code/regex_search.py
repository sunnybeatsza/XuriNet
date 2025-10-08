# A RegEx, or Regular Expression, is a sequence of characters that forms a search pattern.
# RegEx can be used to check if a string contains the specified search pattern.
import re

def extract_locations(text):
    # Example regex for location lines
    pattern = r'(lived.*)'
    matches = re.findall(pattern, text, re.IGNORECASE)
    return "\n".join(matches)
