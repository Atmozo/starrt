import { sleep } from 'k6';
import ws from 'k6/ws';

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp-up to 50 users
    { duration: '1m', target: 50 },  // Hold at 50 users
    { duration: '30s', target: 0 },  // Ramp-down to 0 users
  ],
};

export default function () {
  const url = 'ws://localhost:8080'; 
  const params = { tags: { name: 'WebSocketTest' } };

  const response = ws.connect(url, params, function (socket) {
    socket.on('open', () => {
      console.log('Connected');
      socket.send('Hello Server!');
    });

    socket.on('message', (message) => {
      console.log(`Received message: ${message}`);
    });

    socket.on('close', () => {
      console.log('Disconnected');
    });

    socket.on('error', (e) => {
      console.log('Error:', e.error());
    });

    sleep(1);
    socket.close();
  });

  if (!response) {
    console.error('Connection failed!');
  }
}
