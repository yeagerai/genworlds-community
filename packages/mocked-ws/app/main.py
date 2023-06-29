import debugpy
debugpy.listen(("0.0.0.0", 5680))

import json
import asyncio
from datetime import datetime

from pydantic import BaseModel
from fastapi import FastAPI, WebSocket


class WebSocketManager:
    def __init__(self):
        self.active_connections = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)

    async def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_message_to_all(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


class MockedWES(BaseModel):
    data: str


app = FastAPI()
websocket_manager = WebSocketManager()


@app.post("/send-mocked-world-event-stream")
async def send_mocked_world_event_stream(
    mocked_world_event_stream: MockedWES,
):  # a txt, one event per line
    events = [
        json.loads(e)
        for e in mocked_world_event_stream.data.split("\n")
        if "created_at" in e
    ]

    for e in events:
        e["created_at"] = datetime.fromisoformat(e["created_at"])

    sorted_events = sorted(events, key=lambda x: x["created_at"])

    while True:
        print(sorted_events[0])
        await websocket_manager.send_message_to_all(sorted_events[0])
        current_time = sorted_events[0]["created_at"]
        for event in sorted_events[1:]:
            await asyncio.sleep((event["created_at"] - current_time).seconds)
            print(event)
            await websocket_manager.send_message_to_all(event)
            current_time = event["created_at"]


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(data)
            await websocket_manager.send_message_to_all(data)
    except:
        await websocket_manager.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7455)
