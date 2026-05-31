import requests

def test_api():
    try:
        url = "http://127.0.0.1:8000/api/generate-image"
        payload = {"dream_text": "Karanlık bir ormanda koşuyordum, uçuyordum"}
        response = requests.post(url, json=payload, timeout=10)
        print("STATUS CODE:", response.status_code)
        print("RESPONSE:", response.json())
    except Exception as e:
        print("ERROR:", e)

if __name__ == "__main__":
    test_api()
