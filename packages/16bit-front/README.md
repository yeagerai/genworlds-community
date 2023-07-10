# Yeager - Tank Viewer Monorepo

Yeager - monorepo using `"lerna": "^6.6.1"`

## Production

// TODO: Write description

## Development

### Setup environment

- Install dependencies:

  ```bash
  nvm use
  yarn setup
  ```

### Start development

- To begin working on the project

  ```bash
  yarn start
  ```
  
  Then open [http://localhost:9000/?tankId=1](http://localhost:9000/?tankId=1) to view it in the browser. To switch map, just change the `tankId` query param.

- To raise a local environment to work with other services (i.ex.: frontend apps)

  ```bash
  yarn [start:dev | start:prod]
  ```

### Best practices

This project uses `husky`, `eslint`, `prettier`, `commitizen` and `commitlint` to ensure good practices when programming and adding changes to the code.

It is automatically configured after running the `yarn install` script, since git hooks are used through `husky`.

It is also recommended to use the @recommended vscode plugins that have been left enabled in the project.

Configured git hooks:

- pre-commit: `type-check && lint`
- pre-push: `test && build`
- post-merge: `install new dependencies`, if added
- commit-msg & prepare-commit-msg: `commit formating with commitlint + commitizen`

## Available scripts

// TODO: Write description

## Inspirational articles

- [Modular Game Worlds in Phaser 3 (Tilemaps #1)  -  Static Maps](https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6)
- [Create A Basic Multiplayer Game In Phaser 3 With Socket.io – Part 2](https://gamedevacademy.org/create-a-basic-multiplayer-game-in-phaser-3-with-socket-io-part-2/)
- [How To Build A Real-Time Multi-User Game From Scratch](https://www.smashingmagazine.com/2021/10/real-time-multi-user-game/)
