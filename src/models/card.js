const events = [
    { title: "Evento 1", price: 100, category: "Turismo" },
    { title: "Evento 2", price: 50, category: "Infantil" },
    { title: "Evento 3", price: 75, category: "Cultural" },
    { title: "Evento 4", price: 120, category: "Fiestas" },
    { title: "Evento 5", price: 0, category: "Gratuitos" },
];

function loadEventCards() {
    const container = document.getElementById('event-cards');
    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'card col-md-3'; 
        card.innerHTML = `
            <h5 class="card-title">${event.title}</h5>
            <p class="card-price">$${event.price}</p>
            <button class="btn btn-primary" onclick="addToCart('${event.title}', ${event.price})">Agregar al Carrito</button>
        `;
        container.appendChild(card);
    });
}

function addToCart(title, price) {
    console.log(`Evento agregado: ${title} - Precio: $${price}`);
  
}


document.addEventListener('DOMContentLoaded', loadEventCards);
