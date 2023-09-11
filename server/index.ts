import type { MaybeVehicle } from '~/types/vehicles';

const PORT = 3001;
const posRoom = 'position';

type PosMessage = {
  marker: {
    longitude: number;
    latitude: number;
  };
  selected: MaybeVehicle;
};

const server = Bun.serve({
  fetch(req, server) {
    const success = server.upgrade(req);
    if (success) {
      //Bun returns a 101 if the upgrade succeeds, so we can just return undefined
      return undefined;
    }
    return new Response('Hello world!');
  },
  port: PORT,
  websocket: {
    open(ws) {
      ws.subscribe(posRoom);
      ws.publish(posRoom, 'Someone joined');
      console.log(ws.isSubscribed(posRoom));
    },
    close(ws) {
      ws.publish(posRoom, 'someone left');
      ws.unsubscribe(posRoom);
    },
    async message(ws, message) {
      console.log(`Received ${message}`);
      if (message.includes('marker') && typeof message === 'string') {
        const posMessage: PosMessage = JSON.parse(message);
        console.log(posMessage);
        ws.publish(posRoom, message);
      }
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
