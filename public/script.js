function bounceButton() {
    const button = document.getElementById('create-event-btn');
    button.classList.add('bounce');

    setTimeout(() => {
        button.classList.remove('bounce');
    }, 2000); 
}

document.getElementById('create-event-btn').addEventListener('click', function() {
    window.location.href = '/realtimeproducts'; 
});

setInterval(bounceButton, 2000);
