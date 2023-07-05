from collections import deque
import json
import time
import threading
from datetime import datetime

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from genworlds.sockets.world_socket_server import WebSocketManager
from genworlds.sockets.world_socket_client import WorldSocketClient

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

websocket_manager = WebSocketManager()

SPEEDUP_RATIO = 10
stop_events = deque()

def send_events(events, stop_event: threading.Event):
    ws_client = WorldSocketClient(process_event=lambda x: x, url="ws://127.0.0.1:7455/ws")
    threading.Thread(
            target=ws_client.websocket.run_forever,
            name="mocked-ws-client",
            daemon=True,
        ).start()
    time.sleep(2)
    for e in events:
        e["created_at"] = datetime.fromisoformat(e["created_at"]).isoformat()

    while True:
        for (current_event, next_event) in zip(events, events[1:] + [None]):
            print(stop_event.is_set())
            if stop_event.is_set():
                print("stopping")
                return
            
            ws_client.send_message(json.dumps(current_event))

            if not next_event:
                return
            
            current_time = datetime.fromisoformat(current_event["created_at"])
            next_time = datetime.fromisoformat(next_event["created_at"])
            waiting_time = (next_time - current_time).total_seconds() / SPEEDUP_RATIO
            print(f"waiting for {current_time} {next_time} {waiting_time}")
            time.sleep(abs(waiting_time))

@app.get("/start-mocked-ws/{slug}")
async def send_mocked_world_event_stream(slug: str, background_tasks: BackgroundTasks):
    # kill any running threads
    while stop_events:
        print(f"stopping {len(stop_events)} threads: {stop_events}")
        stop_event = stop_events.popleft()
        stop_event.set()
        time.sleep(0.1)

    with open(f"use_cases/{slug}/mocked_record.json", "r") as f:
        mocked_event_stream = json.loads(f.read())

    events = mocked_event_stream["events"]
    stop_event = threading.Event()
    stop_events.append(stop_event)
    background_tasks.add_task(send_events, events, stop_event)
    return {"status": "The mocked world is running in the background"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(data)
            await websocket_manager.send_update(data)
    except WebSocketDisconnect as e:
        print(f"WebSocketDisconnect: {e.code}")
    except Exception as e:
        print(f"Exception: {type(e).__name__}, {e}")
        import traceback

        traceback.print_exc()
    finally:
        await websocket_manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=7455)
