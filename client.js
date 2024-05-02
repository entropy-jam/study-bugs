const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
  console.log('Connected to the WebSocket server');
  socket.send('Hello from client!');
};

socket.onmessage = (event) => {
  console.log(`Received message from server: ${event.data}`);
};

socket.onclose = () => {
  console.log('Disconnected from the WebSocket server');
};

socket.onerror = (error) => {
  console.log('Error occurred:', error);
};
