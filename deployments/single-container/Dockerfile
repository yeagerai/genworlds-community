# first is to build all artifcats using node
# second is to copy all artifacts to the final python image
# third is to copy all python scripts and pip install all dependencies
# fourth is to execute the runner
# ---- Stage 1: Build all artifacts using Node ----
FROM node:18-alpine AS node-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # or whatever build command your app requires

# ---- Stage 2: Copy artifacts to the final Python image ----
FROM python:3.9 AS python-stage
WORKDIR /app

# Copy build artifacts from node-stage
COPY --from=node-builder /app/build ./build

# ---- Stage 3: Copy all Python scripts and pip install all dependencies ----
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY ./path_to_your_python_scripts/ ./path_in_container/

# ---- Stage 4: Execute the runner ----
CMD ["python", "your-runner-script.py"]
