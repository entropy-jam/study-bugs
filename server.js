const WebSocket = require('ws');
const crypto = require('crypto');

const wss = new WebSocket.Server({ port: 8080 });
let connectedClients = 0; // Variable to keep track of the number of connected clients
let activeClients = 0; // Variable to keep track of the active connected clients

// Function to hash client IP
const hashIdentifier = (input) => {
    return crypto.createHash('sha256').update(input).digest('hex');
};

wss.on('connection', (ws, req) => {
    // Increment the count on new connection
    connectedClients++;
  
    // Hash the remote IP address
    const userIdentifier = hashIdentifier(req.socket.remoteAddress);
  
    console.log(`Client connected with ID: ${userIdentifier}`);
    console.log(`Number of connected clients: ${connectedClients}`);

    ws.on('message', (message) => {
        console.log(`Received message from ID ${userIdentifier} => ${message}`);
        ws.send(`Server response: ${message}`);
    });

    ws.on('close', () => {
        // Decrement the count on disconnection
        connectedClients--;
        console.log(`Client with ID ${userIdentifier} disconnected`);
        console.log(`Number of connected clients: ${connectedClients}`);
    });
});
