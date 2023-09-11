const PORT = 3001;

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
      ws.subscribe('test-room');
      ws.publish('test-room', 'Someone joined');
      console.log(ws.isSubscribed('test-room'));
    },
    close(ws) {
      ws.publish('test-room', 'someone left');
      ws.unsubscribe('test-room');
    },
    async message(ws, message) {
      console.log(`Received ${message}`);
      ws.send(`You said: ${message}`);
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
