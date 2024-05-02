const WebSocket = require('ws')
const crypto = require('crypto')

console.log("server.js is running...")
const wss = new WebSocket.Server({ port: 8080 })
let connectedClients = 0 // Variable to keep track of the number of connected clients
let activeClients = 0 // Variable to keep track of the number of active clients

// Function to hash client IP
const hashIdentifier = (input) => {
    return crypto.createHash('sha256').update(input).digest('hex')
}

wss.on('connection', (ws, req) => {
    // Increment the count on new connection
    connectedClients++
  
    // Hash the remote IP address
    const userIdentifier = hashIdentifier(req.socket.remoteAddress)
  
    console.log(`Client connected with ID: ${userIdentifier}`)
    console.log(`Number of connected clients: ${connectedClients}`)
    console.log(`Number of active clients: ${activeClients}`)
    
    ws.on('message', (message) => {
        const msg = JSON.parse(message)
        if (msg.active !== undefined) {
            if (msg.active) {
                activeClients++
            } else {
                activeClients--
            }
            console.log(`Client ${userIdentifier} is now ${msg.active? 'active' : 'inactive'}`)
            console.log(`Number of active clients: ${activeClients}`)
        } else if (msg.ping !== undefined) {
            ws.send(JSON.stringify({ activeClients: activeClients }))
        } else {
            console.log(`Received message from ID ${userIdentifier} => ${message}`)
            ws.send(`Server response: ${message}`)
        }
    })
    
    ws.on('close', () => {
        // Decrement the count on disconnection
        connectedClients--
        console.log(`Client with ID ${userIdentifier} disconnected`)
        console.log(`Number of connected clients: ${connectedClients}`)
        console.log(`Number of active clients: ${activeClients}`)
    })
})
