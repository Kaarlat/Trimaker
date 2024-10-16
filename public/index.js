const socket = io();

async function askForUsername() {
    const { value: username } = await Swal.fire({
        title: 'Identifícate',
        input: 'text',
        inputLabel: 'Introduce tu nombre',
        inputPlaceholder: 'Escribe tu nombre aquí...',
        showCancelButton: true,
        confirmButtonText: 'Ingresar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return '¡Debes escribir tu nombre!';
            }
        },
        allowOutsideClick: false
    });

    if (username) {
        document.getElementById('messageInput').disabled = false;
        document.getElementById('sendButton').disabled = false;

        socket.emit('setUsername', username);
    } else {
        askForUsername();
    }
}

askForUsername();

const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messageContainer = document.getElementById('messageContainer');

sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('newMessage', message);
        messageInput.value = ''; 
    }
});

socket.on('messageHistory', (messages) => {
    messages.forEach(msg => {
        const p = document.createElement('p');
        p.textContent = `${msg.socketid}: ${msg.mensaje}`;
        messageContainer.appendChild(p);
    });
});

socket.on('newMessage', (message) => {
    const p = document.createElement('p');
    p.textContent = `${message.socketid}: ${message.mensaje}`;
    messageContainer.appendChild(p);
});
