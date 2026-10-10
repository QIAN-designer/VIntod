import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # match template: `...`
    template_match = re.search(r'template:\s*`([^`]+)`', content)
    # match styles: [`...`] or styles: `...`
    style_match = re.search(r'styles:\s*\[\s*`([^`]+)`\s*\]', content)
    if not style_match:
        style_match = re.search(r'styles:\s*`([^`]+)`', content)

    if not template_match and not style_match:
        return

    base_path = os.path.splitext(filepath)[0]
    filename = os.path.basename(base_path)

    new_content = content
    
    if template_match:
        html_content = template_match.group(1).strip()
        html_path = base_path + '.html'
        with open(html_path, 'w') as f:
            f.write(html_content + '\n')
        # replace in content
        new_content = re.sub(r'template:\s*`[^`]+`', f"templateUrl: './{filename}.html'", new_content)

    if style_match:
        css_content = style_match.group(1).strip()
        css_path = base_path + '.css'
        with open(css_path, 'w') as f:
            f.write(css_content + '\n')
        # replace in content
        new_content = re.sub(r'styles:\s*\[\s*`[^`]+`\s*\]', f"styleUrl: './{filename}.css'", new_content)
        new_content = re.sub(r'styles:\s*`[^`]+`', f"styleUrl: './{filename}.css'", new_content)

    with open(filepath, 'w') as f:
        f.write(new_content)
    
    print(f"Processed {filepath}")

for root, _, files in os.walk('src/app'):
    for file in files:
        if file.endswith('.component.ts'):
            process_file(os.path.join(root, file))

