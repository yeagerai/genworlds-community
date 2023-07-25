# Use an official Python runtime as a parent image
FROM python:3.11.3-slim

# Set the working directory in the container to /app
WORKDIR /app

RUN pip install poetry debugpy

# Copy all files
COPY ./genworlds-community/packages/real-ws/ ./real-ws/
COPY ./genworlds/ ./genworlds/

# Install genworlds from local synced folder
RUN cd ./genworlds && poetry config virtualenvs.create false && poetry install 


EXPOSE 7456
EXPOSE 5679

ENV PYTHONPATH=/app:$PYTHONPATH

# Run main.py when the container launches
CMD ["sh", "-c", "python -u -m debugpy --listen 0.0.0.0:5679 real-ws/main.py"]
