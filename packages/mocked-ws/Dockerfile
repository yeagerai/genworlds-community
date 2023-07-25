FROM python:3.11.3-slim

WORKDIR /app

# Install Poetry & Debugger
RUN pip install poetry debugpy

# Copy all files
COPY ./genworlds-community/packages/mocked-ws/ ./mocked-ws/
COPY ./genworlds/ ./genworlds/

# Install genworlds from local synced folder
RUN cd ./genworlds && poetry config virtualenvs.create false && poetry install 

EXPOSE 7455
EXPOSE 5680

ENV PYTHONPATH=/app:$PYTHONPATH

CMD ["sh", "-c", "python -u -m debugpy --listen 0.0.0.0:5680 -m uvicorn --reload --host 0.0.0.0 --port 7455 app.main:app"]
