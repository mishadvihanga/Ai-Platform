# parse_pdf.py
import sys
import json
from pypdf import PdfReader

def extract_text_from_pdf(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        
        # Node.js වලට කියවන්න ලේසි වෙන්න JSON එකක් විදිහට output එක දෙනවා
        return json.dumps({"text": text, "error": None})
    except Exception as e:
        return json.dumps({"text": "", "error": str(e)})

if __name__ == "__main__":
    if len(sys.argv) > 1:
        pdf_file_path = sys.argv[1]
        output = extract_text_from_pdf(pdf_file_path)
        print(output)
    else:
        print(json.dumps({"text": "", "error": "No file path provided"}))