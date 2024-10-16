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

const socket = io();

document.addEventListener('DOMContentLoaded', () => {
 
    const events = [
        { title: "Evento Cultural", category: "Cultural", price: 100 },
        { title: "Concierto Infantil", category: "Infantil", price: 50 },
        { title: "Fiesta de Verano", category: "Fiestas", price: 75 },
        { title: "Tour de Turismo", category: "Turismo", price: 150 },
        { title: "Gastronomía Chilena", category: "Gastronómicos", price: 60 },
        { title: "Aventura en la Naturaleza", category: "Aventura", price: 200 },
        { title: "Día del Adulto Mayor", category: "Adulto Mayor", price: 40 },
    ];

    const eventsContainer = document.getElementById('events-container'); 

    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${event.title}</h5>
                    <p class="card-text">Categoría: ${event.category}</p>
                    <p class="card-text">Precio: $${event.price}</p>
                    <input type="number" min="1" value="1" class="quantity" placeholder="Cantidad">
                    <button class="btn btn-primary add-to-cart" data-title="${event.title}" data-price="${event.price}">Agregar al Carrito</button>
                </div>
            </div>
        `;
        eventsContainer.appendChild(card);
    });

    const cartCountElement = document.getElementById('cart-count'); 
    let cartCount = 0; 

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const quantityInput = button.previousElementSibling;
            const quantity = parseInt(quantityInput.value, 10);
            const title = button.getAttribute('data-title');
            const price = button.getAttribute('data-price');

            if (quantity > 0) {
              
                socket.emit('addToCart', { title, price, quantity });
                console.log(`Agregar ${quantity} de ${title} al carrito a $${price} cada uno.`);

                cartCount += quantity; 
                updateCartCount();
            } else {
                alert("Por favor, selecciona una cantidad válida.");
            }
        });
    });

    function updateCartCount() {
        cartCountElement.textContent = cartCount; 
    }
});
