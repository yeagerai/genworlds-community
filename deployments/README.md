# How to build and run the image

```sh
docker build -t genworlds-world-app -f ./deployments/single-container/Dockerfile .
docker run -p 80:80 -p 9000:9000 -d genworlds-world-app
```

Then open the browser and go to `http://localhost/`

## Architecture

```mermaid
graph LR
    subgraph Docker-Container
        subgraph Frontend
            A[Frontend interface - Vue]
        end
        
        subgraph Backend
            C[World Instance - FastAPI REST]
            F[16bit game backend - TS + Colyseus]
            G[Redis Server]
            D[Real web socket - FastAPI WS]
            E[Mocked web socket - FastAPI WS]
            B[16bit game interface - TS + Phaser.io]
            H[Gateway server - JS]
        end
    end
    
    C <--> D
    B <--> F
    D <--> F
    E <--> C
    F <--> E
    F <--> G

    A <--Calls servers using subpaths http/s--> H
    B <--http--> H
    C <--http--> H
    F <--ws--> H
    D <--ws--> H
    E <--ws--> H
```

### Services

#### Frontend

* Frontend interface - Vue: `http://localhost/` port `80` (exposed to the host)
* 16bit game interface - TS + Phaser.io: `http://localhost:8081/` port `8081`

#### Backend

* Gateway server - JS: `http://localhost:9000/` port `9000` (exposed to the host)
* World Instance - FastAPI REST: `http://localhost:7457/` port `7457`
* Real web socket - FastAPI WS: `http://localhost:7456/` port `7456`
* Mocked web socket - FastAPI WS: `http://localhost:7455/` port `7455`
* 16bit game backend - TS + Colyseus: `http://localhost:5000/` port `5000`
* Redis Server: `http://localhost:6379/` port `6379`
