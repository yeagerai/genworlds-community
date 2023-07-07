# Use an official Python runtime as a parent image
FROM python:3.11.3-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY packages/world-instance /app
COPY use_cases /app/use_cases

# If you have any environment files, copy them
COPY .env /app/.env
COPY packages/world-instance/requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install debugpy==1.6.0

# Make port 7457 available to the world outside this container
EXPOSE 7457

# Expose debug port
EXPOSE 5678

# Run main.py when the container launches
CMD ["sh", "-c", "python -u -m debugpy --listen 0.0.0.0:5678 -m uvicorn --reload --host 0.0.0.0 --port 7457 main:app"]
