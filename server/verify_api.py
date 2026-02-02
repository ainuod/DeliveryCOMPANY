import requests
import sys

BASE_URL = "http://127.0.0.1:8000/api"

def test_api():
    print("Testing API...")
    
    # 1. Login
    try:
        response = requests.post(f"{BASE_URL}/token/", data={
            "username": "testadmin",
            "password": "TestPass123"
        })
        if response.status_code == 200:
            print("[PASS] Login successful")
            token = response.json()['access']
        else:
            print(f"[FAIL] Login failed: {response.text}")
            return
    except Exception as e:
        print(f"[FAIL] Connection refused. Is the server running? Error: {e}")
        return

    headers = {"Authorization": f"Bearer {token}"}

    # 2. Test Me Endpoint
    resp = requests.get(f"{BASE_URL}/users/me/", headers=headers)
    if resp.status_code == 200 and resp.json()['username'] == 'testadmin':
        print("[PASS] Me Endpoint (WhoAmI)")
    else:
        print(f"[FAIL] Me Endpoint: {resp.text}")

    # 3. Test Shipments
    resp = requests.get(f"{BASE_URL}/shipments/", headers=headers)
    if resp.status_code == 200:
        print(f"[PASS] Shipments List (Count: {len(resp.json())})")
    else:
        print(f"[FAIL] Shipments List: {resp.text}")

    # 4. Test Payments
    resp = requests.get(f"{BASE_URL}/payments/", headers=headers)
    if resp.status_code == 200:
        # Check if new fields exist in first item if any
        data = resp.json()
        if data:
            if 'invoice_id' in data[0] and 'client_username' in data[0]:
                print("[PASS] Payments List Structure Verified")
            else:
                print(f"[FAIL] Payments List missing expected fields: {data[0].keys()}")
        else:
            print("[PASS] Payments List (Empty)")
    else:
        print(f"[FAIL] Payments List: {resp.text}")

if __name__ == "__main__":
    test_api()
