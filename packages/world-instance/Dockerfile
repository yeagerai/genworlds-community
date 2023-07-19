# Use an official Python runtime as a parent image
FROM python:3.11.3-slim

# Set the working directory in the container to /app
WORKDIR /app

RUN pip install poetry debugpy

# Copy the current directory contents into the container at /app
# Copy all files
COPY ./genworlds-community/packages/world-instance/ ./world-instance/
COPY ./genworlds/ ./genworlds/

# Project initialization:
RUN cd ./genworlds && poetry config virtualenvs.create false && poetry install 

# If you have any environment files, copy them
COPY ./genworlds-community/.env ./world-instance/.env

# Make port 7457 available to the world outside this container
EXPOSE 7457

# Expose debug port
EXPOSE 5678

# Run main.py when the container launches
CMD ["sh", "-c", "python -u -m debugpy --listen 0.0.0.0:5678 -m uvicorn --reload --host 0.0.0.0 --port 7457 main:app"]
