import json
import re
import os

with open('/home/mrp/.gemini/antigravity/brain/5bf0db33-8834-4763-8d1e-1fb2c549ad55/.system_generated/logs/transcript_full.jsonl', 'r') as f:
    for line in f:
        data = json.loads(line)
        if 'tool_calls' in data:
            for call in data['tool_calls']:
                if call['name'] == 'run_command':
                    cmd = call['args'].get('CommandLine', '')
                    # In json, cmd is a string. If it contains literal '\n', let's use string operations
                    # wait, it might be literally "\\n" in the string if it was JSON parsed.
                    # let's replace literal "\\n" with "\n" to simplify regex
                    cmd = cmd.replace('\\n', '\n')
                    matches = re.finditer(r"cat << '?EOF'? > ([^\n]+)\n(.*?)\nEOF", cmd, re.DOTALL)
                    for match in matches:
                        filepath = match.group(1).strip()
                        content = match.group(2)
                        
                        # Fix escaped quotes if any
                        content = content.replace('\\"', '"').replace('\\`', '`').replace('\\\\', '\\')
                        
                        os.makedirs(os.path.dirname(filepath), exist_ok=True)
                        with open(filepath, 'w') as out:
                            out.write(content)
                        print(f"Restored {filepath}")
