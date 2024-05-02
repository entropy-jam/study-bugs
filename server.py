import asyncio
import websockets

class StudyBugProtocol(websockets.WebSocketServerProtocol):
    def onConnect(self, request):
        print("Client connecting: {0}".format(request.peer))

    def onOpen(self):
        print("WebSocket connection open.")

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {0}".format(reason))

    def onMessage(self, payload, isBinary):
        if isBinary:
            print("Binary message received: {0} bytes".format(len(payload)))
        else:
            print("Text message received: {0}".format(payload.decode('utf8')))
        # echo back message verbatim
        self.sendMessage(payload, isBinary)

async def main():
    async with websockets.serve(StudyBugProtocol, "localhost", 5000):
        print("WebSocket server started on port 5000")
        await asyncio.Future()  # run forever

asyncio.run(main())
