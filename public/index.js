const socket = io();

const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messagesDiv = document.getElementById('messages');

const addMessage = (message) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = `${message.socketid}: ${message.mensaje}`;
    messagesDiv.appendChild(messageElement);
};

const sendMessage = () => {
    const message = messageInput.value;
    if (message.trim()) {
        socket.emit('newMessage', message);
        messageInput.value = '';
    }
};

socket.on('messageHistory', (messageHistory) => {
    messageHistory.forEach(addMessage);
});

socket.on('newMessage', (message) => {
    addMessage(message);
});

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
