import requests

url = "http://0.0.0.0:7456/send-mocked-world-event-stream"

# Replace with the actual JSON you want to send
with open("./10min_events.txt", "r") as f:
    mocked_world_event_stream = {"data": f.read()}

headers = {"Content-Type": "application/json"}

response = requests.post(url, json=mocked_world_event_stream, headers=headers)

if response.status_code == 200:
    print("Successfully sent mocked world event stream.")
else:
    print(
        f"Error sending mocked world event stream. Status code: {response.status_code}"
    )
