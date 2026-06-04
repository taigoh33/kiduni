
import re

content_path = 'src/constants/content.ts'
with open(content_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract IDs from CATEGORIES
categories_match = re.search(r'export const CATEGORIES: Category\[\] = \[(.*?)\];', content, re.DOTALL)
category_ids = []
if categories_match:
    cat_block = categories_match.group(1)
    category_ids = re.findall(r"id: '([^']+)'", cat_block)

# Extract category IDs from LEARNING_ITEMS
learning_items_match = re.search(r'export const LEARNING_ITEMS: LearningItem\[\] = \[(.*?)\];', content, re.DOTALL)
item_category_ids = []
if learning_items_match:
    item_block = learning_items_match.group(1)
    item_category_ids = list(set(re.findall(r"category: '([^']+)'", item_block)))

print(f"Categories in CATEGORIES array: {len(category_ids)}")
print(f"Unique categories in LEARNING_ITEMS: {len(item_category_ids)}")

missing_in_categories = [cid for cid in item_category_ids if cid not in category_ids]
print(f"Categories in items but NOT in CATEGORIES: {missing_in_categories}")

# Count by group in CATEGORIES
group_counts = {}
group_matches = re.findall(r"id: '([^']+)'.*?group: '([^']+)'", cat_block, re.DOTALL)
for cid, group in group_matches:
    group_counts[group] = group_counts.get(group, 0) + 1
print(f"Group counts: {group_counts}")

# Specifically look for dialogue group count
dialogue_categories = [cid for cid, grp in group_matches if grp == 'dialogue']
print(f"Dialogue categories ({len(dialogue_categories)}): {dialogue_categories}")
