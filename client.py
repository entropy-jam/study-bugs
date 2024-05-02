import time
import websocket
from websocket_client import WebSocketApp
# Create a WebSocket connection
ws = WebSocketApp("ws://localhost:5000",
                            on_open=on_open,
                            on_message=on_message,
                            on_error=on_error,
                            on_close=on_close)

def on_open(ws):
    print("Opened connection")

def on_message(ws, message):
    print("Received message: {0}".format(message))

def on_error(ws, error):
    print("Error occurred: {0}".format(error))

def on_close(ws, close_status_code, close_msg):
    print("### closed ###")

# Run the WebSocket client
ws.run_forever()
