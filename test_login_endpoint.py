import requests

def test_login_endpoint():
    url = "http://localhost:5001/api/auth/login"
    payload = {
        "email": "mohammedainan3@gmail.com",
        "password": "AInan_122"
    }
    
    try:
        print(f"Testing login at {url}...")
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login_endpoint()
