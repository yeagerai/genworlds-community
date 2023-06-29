import debugpy
debugpy.listen(("0.0.0.0", 5678))

from fastapi import FastAPI
from pydantic import BaseModel
import threading

app = FastAPI()

class Data(BaseModel):
    message: str

@app.post("/use_case")
async def trigger_world(data: Data):
    import os
    from dotenv import load_dotenv
    load_dotenv()

    openai_api_key = os.environ.get('OPENAI_API_KEY')
    port = 7456 if openai_api_key else 7455
    is_mocked = not openai_api_key

    if data.message == "generic_roundtable":
        if is_mocked:
            return {"status": "The world is running in the background", "port": port, "is_mocked": is_mocked}
        else:
            from use_cases.roundtable.world_setup_tot import launch_use_case
            threading.Thread(target=launch_use_case).start()
            return {"status": "The world is running in the background", "port": port, "is_mocked": not openai_api_key}

    elif data.message == "all_in_podcast":
        if is_mocked:
            return {"status": "The world is running in the background", "port": port, "is_mocked": is_mocked}
        else:
            from use_cases.roundtable.world_setup_tot import launch_use_case
            threading.Thread(target=launch_use_case).start()
            return {"status": "The world is running in the background", "port": port, "is_mocked": not openai_api_key}

    else:
        if is_mocked:
            return {"status": "The world is running in the background", "port": port, "is_mocked": is_mocked}
        else:
            from use_cases.roundtable.world_setup_tot import launch_use_case
            threading.Thread(target=launch_use_case).start()
            return {"status": "The world is running in the background", "port": port, "is_mocked": not openai_api_key}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7457)