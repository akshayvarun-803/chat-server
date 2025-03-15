let socket;
let room;

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.style.display = 'none';

function joinRoom() {
  const name = document.getElementById('name-input').value.trim();
  room = document.getElementById('room-input').value.trim();

  if (!name || !room) {
    alert('Please enter both name and room!');
    return;
  }

  socket = io();

  socket.emit('join-room', { room, name });

  appendMessage(`You joined ${room}`);

  form.style.display = 'flex';

  socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`);
  });

  socket.on('user-connected', name => {
    appendMessage(`${name} joined the chat`);
  });

  socket.on('user-disconnected', name => {
    appendMessage(`${name} left the chat`);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (input.value) {
      appendMessage(`You: ${input.value}`);
      socket.emit('send-chat-message', input.value);
      input.value = '';
    }
  });
}

function appendMessage(message) {
  const item = document.createElement('li');
  item.textContent = message;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}
