document.addEventListener('snipcart.ready', () => {

    /* ---------------------------------------------------
       1. Add Tilopay as a manual payment method
    --------------------------------------------------- */

    /* ---------------------------------------------------
       2. When user selects Tilopay, show our form
    --------------------------------------------------- */
    Snipcart.events.on('payment.method.selected', async method => {
        if (method.id !== "tilopay") return;

        const tilopayForm = document.querySelector("#tilopay-form");
        tilopayForm.style.display = "block";

        const cart = Snipcart.store.getState().cart;

        /* ------------------------------------------
           Fetch secure Tilopay SDK token
        ------------------------------------------- */
        const res = await fetch("/api/tilopay-token");
        const { token } = await res.json();

        /* Initialize Tilopay SDK */
        const init = await Tilopay.Init({
            token,
            language: "es",
            currency: "USD",
            amount: cart.total,
            orderNumber: "SNIP-" + Date.now(),
            billToFirstName: cart.billingAddress.firstName,
            billToLastName: cart.billingAddress.lastName,
            billToEmail: cart.email,
            billToAddress: cart.billingAddress.address1,
            capture: 1,
            redirect: "https://myguate.com/pago-exitoso",
            subscription: 0
        });

        loadPaymentMethods(init.methods);
        loadCardOptions(init.cards);
    });

    /* ---------------------------------------------------
       3. Payment button pressed
    --------------------------------------------------- */
    document.getElementById("tilopay-pay-btn").addEventListener("click", async () => {
        const result = await Tilopay.startPayment();

        if (result.error) {
            alert("Error: " + result.error);
            return;
        }

        Snipcart.api.cart.completeOrder({
            paymentStatus: "paid",
            transactionId: result.id
        });
    });

});

/* ---------------------------------------------------
   Helper: Load payment methods options
--------------------------------------------------- */
function loadPaymentMethods(methods) {
    const select = document.getElementById("tlpy_payment_method");
    select.innerHTML = "";

    methods.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.method;
        opt.textContent = m.label;
        select.appendChild(opt);
    });

    handleMethodToggle();
    select.addEventListener("change", handleMethodToggle);
}

/* ---------------------------------------------------
   Helper: Toggle card fields / phone fields
--------------------------------------------------- */
function handleMethodToggle() {
    const method = document.getElementById("tlpy_payment_method").value;

    const cardDiv = document.getElementById("tlpy_card_payment_div");
    const phoneDiv = document.getElementById("tlpy_phone_number_div");

    if (method === "CARD") {
        cardDiv.style.display = "block";
        phoneDiv.style.display = "none";
    } else {
        cardDiv.style.display = "none";
        phoneDiv.style.display = "block";
    }
}

/* ---------------------------------------------------
   Helper: Card types from Tilopay
--------------------------------------------------- */
function loadCardOptions(cards) {
    const numberField = document.getElementById("tlpy_cc_number");
    numberField.setAttribute("placeholder", cards.join(" / "));
}
