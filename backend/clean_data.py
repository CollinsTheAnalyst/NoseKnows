import json

# Load the existing data
try:
    with open('data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"Loaded {len(data)} objects.")

    count = 0
    # Loop through all objects
    for entry in data:
        # If the object is a User
        if entry['model'] == 'users.user':  # or 'auth.user' depending on your setup
            # Clear their specific permissions (Groups still work, so this is safe)
            if 'user_permissions' in entry['fields']:
                entry['fields']['user_permissions'] = []
                count += 1
    
    # Save the cleaned data back to the same file
    with open('data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

    print(f"Successfully cleaned permissions for {count} users.")

except FileNotFoundError:
    print("Error: data.json not found. Make sure you are in the backend folder.")
except Exception as e:
    print(f"An error occurred: {e}")