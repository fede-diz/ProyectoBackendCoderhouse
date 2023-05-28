// Integración MercadoPago
const mercadopago = new MercadoPago("TEST-c3dcc17d-96cd-4056-be35-e6a0cd2b7d77", {
    locale: "es-AR",
})

const checkoutButton = document.getElementById("checkout-btn")
    
checkoutButton.addEventListener("click", function () {
    checkoutButton.remove()
    
    const priceElements = document.querySelectorAll("#productsTable tbody td:nth-child(4)")
    let totalPrice = 0;
        
    priceElements.forEach(function (priceElement) {
    const price = parseFloat(priceElement.textContent)
        if (!isNaN(price)) {
            totalPrice += price;
        }
    })
    
    const orderData = {
        quantity: 1,
        description: "Compra de eCommerce",
        price: totalPrice
    }
    
    fetch("https://entrega-final-coder-backend-production.up.railway.app/api/payments/create_preference", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
    })
    .then(function (response) {
        return response.json()
    })
    .then(function (preference) {
        createCheckoutButton(preference.id)
    })
    .catch(function () {
    alert("Unexpected error")
    })
})
    
    
function createCheckoutButton(preferenceId) {
    // Initialize the checkout
    const bricksBuilder = mercadopago.bricks();

    const renderComponent = async (bricksBuilder) => {
        //if (window.checkoutButton) window.checkoutButton.unmount()        // Esto se comenta porque está el remove de la línea 9
        await bricksBuilder.create(
            'wallet',
            'button-checkout', // class/id where the payment button will be displayed
            {
                initialization: {
                    preferenceId: preferenceId
                },
                callbacks: {
                    onError: (error) => console.error(error),
                    onReady: () => {}
                }
            }
        )
    }
    window.checkoutButton = renderComponent(bricksBuilder)
}