import sys
import json
import spacy

# Load spaCy English model
nlp = spacy.load("en_core_web_sm")

def extract_locations(text):
    doc = nlp(text)
    return [ent.text for ent in doc.ents if ent.label_ in ["GPE", "LOC"]]

if __name__ == "__main__":
    # Get JSON from Node.js stdin
    data = json.loads(sys.stdin.read())
    articles = data.get("articles", [])
    
    locations = []
    for article in articles:
        text = f"{article.get('title', '')} {article.get('description', '')} {article.get('content', '')}"
        locations.extend(extract_locations(text))
    
    print(json.dumps(list(set(locations))))  # Return unique locations
