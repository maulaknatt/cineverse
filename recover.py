import json
import os

log_path = r"C:\Users\VARGUY\.gemini\antigravity-ide\brain\e86d235a-2a76-4319-b36e-8cc93975bde3\.system_generated\logs\transcript_full.jsonl"
workspace_dir = r"E:\project\CineVerse"

print("Recovering files...")
with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            data = json.loads(line)
            if "tool_calls" in data:
                for tc in data["tool_calls"]:
                    if tc.get("name") == "write_to_file":
                        args = tc.get("args", {})
                        # The string might be wrapped in quotes
                        target_file = str(args.get("TargetFile", "")).strip('\"')
                        content = str(args.get("CodeContent", "")).strip('\"')
                        
                        # Fix json double escaping if present (since in args it's a string)
                        # We might need to handle actual newlines if they are \n
                        content = content.encode('raw_unicode_escape').decode('unicode_escape')

                        # only process if it's within the workspace
                        if target_file.startswith(workspace_dir):
                            # Ensure we don't restore OMDb stuff!
                            if "omdb" in target_file.lower():
                                continue

                            # Write the file, overwriting whatever is there (which restores the latest version)
                            os.makedirs(os.path.dirname(target_file), exist_ok=True)
                            with open(target_file, "w", encoding="utf-8") as out_f:
                                out_f.write(content)
                            print(f"Restored {target_file}")
        except Exception as e:
            print(f"Error parsing line: {e}")
