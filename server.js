const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
let connectedClients = 0; // Variable to keep track of the number of connected clients

wss.on('connection', (ws) => {
  connectedClients++; // Increment the count on new connection
  console.log('Client connected');
  console.log(`Number of connected clients: ${connectedClients}`);

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
    ws.send(`Server response: ${message}`);
  });

  ws.on('close', () => {
    connectedClients--; // Decrement the count on disconnection
    console.log('Client disconnected');
    console.log(`Number of connected clients: ${connectedClients}`);
  });
});
