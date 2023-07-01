from importlib import import_module
import os
import threading
import json

from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

app = FastAPI()

load_dotenv()

openai_api_key = os.environ.get('OPENAI_API_KEY')
port = 7456 if openai_api_key else 7455
is_mocked = not openai_api_key

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/use-case-list")
def get_use_case_list():
    """
    Get the list of use cases by retrieving the names of folders in the 'use_cases' directory.
    :return: JSONResponse with list of use case names
    """
    def get_folder_names(path):
        return [name for name in os.listdir(path) if os.path.isdir(os.path.join(path, name))]
    use_cases = get_folder_names("use_cases")
    return JSONResponse(content=use_cases)

@app.get("/trigger-use-case/{slug}")
async def trigger_world(slug: str):
    """
    Trigger a specific use case.
    :param slug: Use case identifier (string)
    :return: JSONResponse with status, port, and event stream configuration
    """
    with open(f"use_cases/{slug}/event_stream_config.json", "r") as f:
        event_stream_config = json.loads(f.read())

    response = {
        "status": "The world is running in the background",
        "port": port,
        "is_mocked": not openai_api_key,
        "event_stream_config": event_stream_config
    }

    # all use cases should have a world_setup.py file containing a launch_use_case function
    module_name = f"use_cases.{slug}.world_setup"
    function_name = "launch_use_case"

    if is_mocked:
        return response
    else:
        try:
            module = import_module(module_name)
            launch_use_case = getattr(module, function_name)
            
            threading.Thread(target=launch_use_case).start()
            return response
        except Exception as e:
            return {"status": f"Failed to launch use case. Error: {str(e)}", "port": None, "is_mocked": None}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=7457, log_level="info")