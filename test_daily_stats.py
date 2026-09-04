import requests

def test_daily_stats():
    # Attempting to fetch stats for the demo clinic
    clinic_id = "00000000-0000-0000-0000-000000000000"
    url = f"http://localhost:5001/api/clinic/daily-stats?clinic_id={clinic_id}"
    
    try:
        print(f"Testing daily stats at {url}...")
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        if response.status_code == 200:
            print("✅ Daily stats endpoint is functional!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_daily_stats()
