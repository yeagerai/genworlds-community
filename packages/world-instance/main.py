from collections import deque
import fnmatch
from importlib import import_module
from multiprocessing import Process
import os
import json
import time
import requests

from pydantic import BaseModel
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

app = FastAPI()

load_dotenv()

PORT_REAL_WS = 7456
PORT_MOCKED_WS = 7455

# openai_api_key = os.environ.get('OPENAI_API_KEY')
# port = 7456 if openai_api_key else 7455
# is_mocked = not openai_api_key

running_processes = deque[Process]()

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
    path = "use_cases"
    use_cases = [dir_name for dir_name in os.listdir(path) if os.path.isdir(os.path.join(path, dir_name))]

    world_definitions = []
    for use_case in use_cases:
        try:
            file_names = os.listdir(os.path.join(path, use_case, "world_definitions"))
        except FileNotFoundError:
            print(f"No such directory: {os.path.join(path, use_case, 'world_definitions')}")
            continue

        for file_name in file_names:
            if fnmatch.fnmatch(file_name, '*.yaml'):
                world_definitions.append({
                    "use_case": use_case,
                    "world_definition": file_name,
                })

    return JSONResponse(content=world_definitions)

@app.get("/trigger-use-case/{use_case}/{world_definition}")
async def trigger_world(request: Request, use_case: str, world_definition: str):
    """
    Trigger a specific use case.
    :param slug: Use case identifier (string)
    :return: JSONResponse with status, port, and event stream configuration
    """

    # kill any running threads
    print(f"stopping {len(running_processes)} processes: {running_processes}")
    while running_processes:
        running_processes.popleft().kill()
        time.sleep(1)

    with open(f"use_cases/{use_case}/event_stream_config.json", "r") as f:
        event_stream_config = json.loads(f.read())

    # Get openai_api_key from request header
    openai_api_key = request.headers.get('Openai-Api-Key')

    # Load openai_api_key from .env file if not provided
    if not openai_api_key:
        openai_api_key = os.environ.get('OPENAI_API_KEY')

    port = PORT_REAL_WS if openai_api_key else PORT_MOCKED_WS
    is_mocked = not openai_api_key

    response = {
        "status": "The world is running in the background",
        "port": port,
        "is_mocked": not openai_api_key,
        "event_stream_config": event_stream_config
    }

    # all use cases should have a world_setup.py file containing a launch_use_case function
    module_name = f"use_cases.{use_case}.world_setup"
    function_name = "launch_use_case"

    if is_mocked:
        try:
            requests.get(f"http://localhost:{port}/start-mocked-ws/{use_case}/{world_definition}")
        except Exception as e:
            print(f"An error occurred: {e}")
        return response
    else:
        try:
            module = import_module(module_name)
            launch_use_case = getattr(module, function_name)

            # Set openai API key in environment variable, for the process
            opneai_api_key_env = os.environ.get('OPENAI_API_KEY')
            os.environ['OPENAI_API_KEY'] = openai_api_key
            
            p = Process(target=launch_use_case, kwargs={"world_definition": world_definition})
            running_processes.append(p)
            p.start()

            # restore OPENAI_API_KEY
            if opneai_api_key_env:
                os.environ['OPENAI_API_KEY'] = opneai_api_key_env
            else:
                del os.environ['OPENAI_API_KEY']

            return response
        except Exception as e:
            return {"status": f"Failed to launch use case. Error: {str(e)}", "port": None, "is_mocked": None}
        
@app.get("/kill-all-use-cases")
async def kill_all_use_cases():
    """
    Kill all running use cases
    
    """
    # kill any running threads
    print(f"stopping {len(running_processes)} processes: {running_processes}")
    while running_processes:
        running_processes.popleft().kill()
        time.sleep(1)

    # Kill mocked socket
    try:
        requests.get(f"http://localhost:{port}/kill-mocked-ws")
    except Exception as e:
        print(f"An error occurred: {e}")

    return {"status": "All use cases killed"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=7457, log_level="info")