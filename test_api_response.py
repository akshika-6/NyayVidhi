import requests
import json

# Test the API directly
url = "http://127.0.0.1:8001/ask"
question = "Is verbal agreement valid?"

response = requests.post(url, json={"question": question})

print(f"Status Code: {response.status_code}")
print(f"\nResponse JSON:")
print(json.dumps(response.json(), indent=2))
