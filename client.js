const WebSocketClient = require('websocket').client
const readline = require('readline')

var client = new WebSocketClient()
var isActive = true // initial active state

client.on('connectFailed', function(error) {
    console.log('Connect Error:'+ error.toString())
})

client.on('connect', function(connection) {
    console.log('Connection established!')
    
    connection.on('error', function(error) {
        console.log("Connection error: " + error.toString())
    })
    
    connection.on('close', function() {
        console.log('Connection closed!')
    })
    
    // send initial active state
    connection.send(JSON.stringify({ active: isActive }))
    
    // toggle active state on key press using readline
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    
    rl.setPrompt('Press Enter to toggle active state... ')
    rl.prompt()
    
    rl.on('line', function(line) {
        if (line === 'q') { // if user enters 'q'
            console.log('Exiting...')
            if (isActive) {
                isActive = false
                connection.send(JSON.stringify({ active: isActive }))
            }
            connection.close() // close WebSocket connection
            rl.close() // close readline interface
            process.exit(0)
        } else if (line === '') { // space bar
            isActive =!isActive
            connection.send(JSON.stringify({ active: isActive }))
        }
        rl.prompt()
    })
})

// This was needed for ctrl+c for a minute, but I think it just waits a sec to close out.
// process.on('SIGINT', function() {
//     console.log('Received SIGINT, closing WebSocket connection...')
//     client.abort()
//     setTimeout(function() {
//         process.exit(0)
//     }, 100) // give the WebSocket connection some time to close
// })

client.connect('ws://localhost:8080/')
