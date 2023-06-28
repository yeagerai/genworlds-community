FROM python:3.9

WORKDIR /app

COPY ../packages/mocked-ws/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY ../packages/mocked-ws/app/ app/

EXPOSE 7456

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7456"]