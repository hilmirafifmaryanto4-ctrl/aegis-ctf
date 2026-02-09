import os
import sys
from CTFd import create_app
from CTFd.models import db, Challenges, Flags, Files, ChallengeFiles
from CTFd.utils.uploads import upload_file

# Wrapper to mimic Werkzeug FileStorage for upload_file
class FileWrapper:
    def __init__(self, path):
        self.path = path
        self.filename = os.path.basename(path)
        self.fp = open(path, 'rb')

    def read(self, *args, **kwargs):
        return self.fp.read(*args, **kwargs)
    
    def seek(self, *args, **kwargs):
        return self.fp.seek(*args, **kwargs)
    
    def close(self):
        self.fp.close()

def populate():
    app = create_app()
    with app.app_context():
        # Define challenges
        challenges_data = [
            {
                "name": "Welcome",
                "category": "Misc",
                "description": "Welcome to the CTF! Here is your first flag.",
                "value": 10,
                "flag": "CTF{welcome_to_the_game}",
                "type": "standard",
                "state": "visible"
            },
            {
                "name": "Secret File",
                "category": "Forensics",
                "description": "Find the secret in this file.",
                "value": 50,
                "flag": "CTF{file_analysis_is_fun}",
                "file": "secret.txt",
                "type": "standard",
                "state": "visible"
            },
            {
                "name": "Basic Web",
                "category": "Web",
                "description": "Can you find the flag in the source code?",
                "value": 100,
                "flag": "CTF{web_exploitation_101}",
                "type": "standard",
                "state": "visible"
            },
             {
                "name": "Caesar Cipher",
                "category": "Crypto",
                "description": "Decrypt this: Veni, Vidi, Vici.",
                "value": 100,
                "flag": "CTF{julius_caesar}",
                "type": "standard",
                "state": "visible"
            }
        ]

        print("Creating challenges...")
        for chal_data in challenges_data:
            # Check if challenge exists
            existing = Challenges.query.filter_by(name=chal_data["name"]).first()
            if existing:
                print(f"Challenge {chal_data['name']} already exists. Skipping.")
                continue

            # Create Challenge
            chal = Challenges(
                name=chal_data["name"],
                description=chal_data["description"],
                value=chal_data["value"],
                category=chal_data["category"],
                type=chal_data["type"],
                state=chal_data["state"]
            )
            db.session.add(chal)
            db.session.commit()
            
            # Add Flag
            flag = Flags(
                challenge_id=chal.id,
                content=chal_data["flag"],
                type="static"
            )
            db.session.add(flag)
            
            # Add File if exists
            if "file" in chal_data:
                # In docker, the volume is mounted at /opt/CTFd/dummy_files (if we assume current dir is mounted to /opt/CTFd)
                # Let's verify where populate.py is. It is at /opt/CTFd/populate.py
                # So dummy_files is at /opt/CTFd/dummy_files
                file_path = os.path.join("/opt/CTFd/dummy_files", chal_data["file"])
                if os.path.exists(file_path):
                    f = FileWrapper(file_path)
                    upload_file(file=f, challenge_id=chal.id, type="challenge")
                    f.close()
                    print(f"Uploaded file for {chal.name}")
                else:
                    print(f"File {file_path} not found!")

            db.session.commit()
            print(f"Created challenge: {chal.name}")

if __name__ == "__main__":
    populate()
