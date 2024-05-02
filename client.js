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

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            const msg = JSON.parse(message.utf8Data)
            if (msg.activeClients !== undefined) {
                console.log(`Number of active clients: ${msg.activeClients}`)
            } else {
                console.log(`Server response: ${message.utf8Data}`)
            }
        } else {
            console.log('Received non-UTF8 message')
        }
    })
    
    // send initial active state
    connection.send(JSON.stringify({ active: isActive }))
    
    // toggle active state on key press using readline
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    
    console.log('Press Enter to toggle state, q to quit, and s to get the status of others')
    rl.setPrompt('>')
    rl.prompt()
    
    rl.on('line', function(line) {
        switch (line.trim()) {
            case 'q':
                console.log('Exiting...')
                if (isActive) {
                    isActive = false
                    connection.send(JSON.stringify({ active: isActive }))
                }
                connection.close()
                rl.close()
                process.exit(0)
                break
            case 's': // get status
                console.log('Requesting activity status...')
                connection.send(JSON.stringify({ ping: true }))
                break
            case '':
                isActive = !isActive
                console.log('User is now ' + (isActive ? 'active' : 'inactive'))
                connection.send(JSON.stringify({ active: isActive }))
                break
            default:
                break
        }

        rl.prompt()
    })

    // This was needed for ctrl+c for a minute, but I think it just waits a sec to close out.
    process.on('SIGINT', function() {
        console.log('Received SIGINT, closing WebSocket connection...')

        if (isActive) {
            isActive = false
            connection.send(JSON.stringify({ active: isActive }))
        }

        client.abort()
        setTimeout(function() {
            process.exit(0)
        }, 100) // give the WebSocket connection some time to close
    })

})


client.connect('ws://localhost:8080/')
