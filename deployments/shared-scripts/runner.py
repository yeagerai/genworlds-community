import subprocess
import threading
from time import sleep

def run_service(service):
    print(f"Starting {service['name']}")
    try:
        # If 'cwd' is specified in the service, use it as the current working directory
        cwd = service.get('cwd')
        process = subprocess.Popen(service['command'], shell=True, cwd=cwd)
        process.wait()
    except Exception as e:
        print(f"Error in {service['name']}: {e}")


# Example services, replace the command for the other services with the actual commands to start them
services = [
    {
        'name': 'real-ws',
        'command': 'python ./real-ws/main.py',
    },
    {
        'name': 'mocked-ws',
        'command': 'python -u -m uvicorn --reload --host 0.0.0.0 --port 7455 mocked-ws.app.main:app',
    },
    {
        'name': 'world-instance',
        'command': 'python -u -m uvicorn --reload --host 0.0.0.0 --port 7457 world-instance.main:app',
    },
    {
        'name': 'redis',
        'command': 'redis-server',
    },
    {
        'name': '16bit-back',
        'command': 'node ./src/server.js',
    },
    {
        'name': '16-bit-front',
        'command': 'node ./16bit-front/server.js',
    },
    {
        'name': 'vue-frontend',
        'command': 'node ./nano-vue/server.js',
    },
    {
        'name': 'gateway',
        'command': 'node ./gateway/server.js',
    },
]

# List to keep track of running threads
threads = []

# Launch services
for service in services:
    thread = threading.Thread(target=run_service, args=(service, ))
    # Set the thread as daemon for all services except vue-frontend
    thread.daemon = True
    thread.start()
    threads.append(thread)
    print(f"Started {service['name']}" + (' (daemon)' if thread.daemon else ''))
    sleep(2)

# Wait for all threads to complete
for thread in threads:
    thread.join()