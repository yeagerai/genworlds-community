# How to build and run the image
```sh
docker build -t genworlds-world-app -f ./deployments/single-container/Dockerfile .
docker run -p 80:80 -p 9000:9000 -d genworlds-world-app
```

Then open the browser and go to `http://localhost/`