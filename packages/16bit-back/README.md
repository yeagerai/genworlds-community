# Yeager Game Server

## Setup environment

**Configure the application variables:**

```shell
cp ./example.env ./.env
vim ./.env
```

**[OPTIONAL] Open a mocked world websocket server:**

```shell
nvm use
npm ci
npm run mockedWorld:start:local
```

**Run game server:**

```shell
docker compose up -d

nvm use
npm ci
npm run server:start:local
```

## Run tests

**OS dependencies:**

- docker
- docker-compose
- npm
- pkill (optional)
- gnome-terminal (optional)

**Script:**

```shell
./scripts/run-tests.sh
```
