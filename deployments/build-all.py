import os
import subprocess
import shutil

# build the docker image
subprocess.check_call(['docker', 'build', '--no-cache', '-t', 'genworlds-world-app', '-f', './deployments/docker/Dockerfile', '.'])

# get the id of the image
image_id = subprocess.check_output(['docker', 'inspect', '--format="{{.Id}}"', 'genworlds-world-app']).strip().decode('utf-8')

# create a directory for the build
if not os.path.exists('./replit-build'):
    os.makedirs('./replit-build')

# create a temporary container from the image, copy the files, and remove the container
subprocess.check_call(['docker', 'create', '--name', 'tmp-container', image_id.replace("sha256:","").replace('"','')])
subprocess.check_call(['docker', 'cp', 'tmp-container:/app/.', './replit-build'])
subprocess.check_call(['docker', 'rm', 'tmp-container'])

# copy replit files to the build directory
src_files = os.listdir('./deployments/replit')
for file_name in src_files:
    full_file_name = os.path.join('./deployments/replit', file_name)
    if os.path.isfile(full_file_name):
        shutil.copy(full_file_name, './replit-build')

# zip the build directory
shutil.make_archive('./replit-build', 'zip', './replit-build')
