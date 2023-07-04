import { Tank, TankRoomState } from '@yeager/common-types';
import { Game, setup as setupGame } from '@/modules/game';
import { tankService } from '@/modules/tank';
import { sleep } from '@/modules/utils/sleep';

const setupRoomConnection = async (tank: Tank, game: Game) => {
  try {
    const room = await tankService.joinRoomById<TankRoomState>(tank.roomId);

    //   4.1 Subscribe tank WSS
    //   4.2 Load agents from Tank
    // 5. Update players movement & status from tank info
    room.onStateChange((state) => {
      const { aiAgents: aiAgentsMap } = state;
      // eslint-disable-next-line no-console

      const aiAgents = Array.from(aiAgentsMap, ([, aiAgent]) => aiAgent);

      if (game.isBooted) {
        game.updateAgents(aiAgents);
      }
    });

    // for development purposes, reconnect to room when backend reloads
    room.onLeave(async () => {
      // eslint-disable-next-line no-console
      console.log('onLeave');

      setTimeout(() => {
        setupRoomConnection(tank, game);
      }, 6000);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `Warrning: Room ${tank.roomId} of tank ${tank.id} not available`,
    );
  }
};

export async function main() {
  // 1. Read tankId from url
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const { tankId } = params;

  if (!tankId || typeof tankId !== 'string') {
    window.alert('No tankId detected');
    // eslint-disable-next-line no-console
    console.error('Error: No tankId detected');
    return;
  }

  // 2. Load TankInfo from TankService
  const tank = await tankService.getTank(tankId);
  // 3. Setup Game
  const game = setupGame({
    mapId: tank.mapId,
    tilemap: tank.tilemap,
  });
  //   3.1 Load game assets, tileset info
  await sleep(500);
  // 4. Setup room connection
  await setupRoomConnection(tank, game);
}
