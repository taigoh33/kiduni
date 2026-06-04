
import re

with open('src/constants/content.ts', 'r') as f:
    content = f.read()

categories_match = re.search(r'export const CATEGORIES: Category\[\] = \[(.*?)\];', content, re.DOTALL)
if categories_match:
    categories_str = categories_match.group(1)
    dia_categories = re.findall(r"id: '(dia_.*?)'", categories_str)
    
    for cat_id in dia_categories:
        count = content.count(f"category: '{cat_id}'")
        print(f"{cat_id}: {count}")
