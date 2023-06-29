FROM python:3.11.3-slim

WORKDIR /app

COPY packages/mocked-ws/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install debugpy

COPY packages/mocked-ws/app/ app/

EXPOSE 7456

CMD ["python", "-m", "debugpy", "--listen", "0.0.0.0:5680", "--wait-for-client", "main.py"]