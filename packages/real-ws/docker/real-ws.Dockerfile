# Use an official Python runtime as a parent image
FROM python:3.11.3-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY packages/real-ws /app
COPY packages/real-ws/requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install debugpy

# Make port 80 available to the world outside this container
EXPOSE 7456

# Run main.py when the container launches
CMD ["sh", "-c", "python -u -m debugpy --listen 0.0.0.0:5679 main.py"]