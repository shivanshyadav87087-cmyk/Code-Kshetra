import { io } from 'socket.io-client';

const client1 = io('http://localhost:5000');
const client2 = io('http://localhost:5000');

let c1Connected = false;
let c2Connected = false;

client1.on('connect', () => {
  console.log('Client 1 connected:', client1.id);
  c1Connected = true;
  checkReady();
});

client2.on('connect', () => {
  console.log('Client 2 connected:', client2.id);
  c2Connected = true;
  checkReady();
});

function checkReady() {
  if (c1Connected && c2Connected) {
    console.log('Both clients connected! Creating room...');
    client1.emit('create_room', {
      roomId: 'CHATTEST',
      player: { name: 'Alice' },
      problem: { id: 'two-sum', testCases: [] }
    }, (res) => {
      console.log('Host created room:', res.success);

      client2.emit('join_room', {
        roomId: 'CHATTEST',
        player: { name: 'Bob' }
      }, (res2) => {
        console.log('Guest joined room:', res2.success);

        // Client 2 listens for chat
        client2.on('receive_chat_message', (msg) => {
          console.log('\n🎉 SUCCESS! Client 2 (Bob) received chat message from Client 1 (Alice):', msg);
          process.exit(0);
        });

        // Client 1 sends message
        setTimeout(() => {
          console.log('Client 1 (Alice) emitting send_chat_message...');
          client1.emit('send_chat_message', {
            roomId: 'CHATTEST',
            message: { sender: 'Alice', text: 'Hello Bob! Good luck!' }
          });
        }, 500);
      });
    });
  }
}

setTimeout(() => {
  console.error('FAILED: Timed out waiting for chat message delivery');
  process.exit(1);
}, 4000);
