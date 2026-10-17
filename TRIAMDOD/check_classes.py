import re
import glob

html = open('index.html', encoding='utf-8').read()
matches = re.findall(r'class=["\']([^"\']+)["\']', html)
all_classes = set()
for c in matches:
    for single in c.split():
        all_classes.add(single)

css_content = ''
for f in glob.glob('css/*.css'):
    css_content += open(f, encoding='utf-8').read() + '\n'

missing = []
for c in sorted(all_classes):
    # check for .classname in css
    pattern = r'\.' + re.escape(c) + r'(?![a-zA-Z0-9_-])'
    if not re.search(pattern, css_content):
        missing.append(c)

print(f"Total HTML classes: {len(all_classes)}")
print(f"Missing CSS classes count: {len(missing)}")
print("Missing classes:")
for m in missing:
    print(f"  - {m}")
