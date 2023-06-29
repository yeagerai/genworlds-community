import debugpy
debugpy.listen(("0.0.0.0", 5678))

import os
from fastapi.responses import JSONResponse
from fastapi import FastAPI
from pydantic import BaseModel
import threading

app = FastAPI()

class Data(BaseModel):
    message: str

@app.get("/use-case-list")
def get_use_case_list():
    def get_folder_names(path):
        return [name for name in os.listdir(path) if os.path.isdir(os.path.join(path, name))]
    print("WTF")
    use_cases = get_folder_names("use_cases")
    return JSONResponse(content=use_cases)

@app.post("/use-case")
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