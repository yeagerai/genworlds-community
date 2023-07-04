/* eslint-disable no-console */
import { Client as ColyseusClient, Room } from 'colyseus.js';

import { TankRoomState } from '@app/colyseus/schemas/TankRoomState';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => { setTimeout(() => { resolve(); }, ms); });
}

let room: Room<TankRoomState> | undefined;

function signalHandler(): void {
  if (room) {
    room.leave(true);
  }
}

process.on('SIGINT', signalHandler);
process.on('SIGTERM', signalHandler);

let targetUri = 'ws://localhost:5000';

function readArguments(): void {
  if (process.argv.indexOf('--stg') > -1) {
    targetUri = 'wss://api.yeager.proj.nakimasolutions.com';
  }
}

async function main(): Promise<void> {
  readArguments();

  const wsClient = new ColyseusClient(targetUri);

  const rooms = await wsClient.getAvailableRooms();
  console.log(JSON.stringify(rooms, undefined, 4));

  const { roomId } = rooms[0];
  room = await wsClient.joinById<TankRoomState>(roomId);

  // room.state.aiAgents.onChange((item, key) => {
  //   console.log(`onChange :: item: ${JSON.stringify(item)} ; key: ${JSON.stringify(key)}`);
  // });

  // room.state.aiAgents.onAdd((item, key) => {
  //   console.log(`onAdd :: item: ${JSON.stringify(item)} ; key: ${JSON.stringify(key)}`);
  //   item.onChange((changes) => {
  //     console.log(`item.onChange :: ${JSON.stringify(changes)} \n ----`);
  //   });
  //   item.bubble.onChange((changes) => {
  //     console.log(`item.bubble.onChange :: changes: ${JSON.stringify(changes)} \n ----`);
  //   });
  // });

  room.onStateChange((state) => {
    console.log(`onStateChange :: state: ${JSON.stringify(state)} \n ----`);
  });

  sleep(1000); // 1s
}

main();
