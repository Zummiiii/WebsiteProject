// Toggle mobile menu
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("navMenu").classList.toggle("active");
});

// Close modal
document.getElementById("closeCart").addEventListener("click", () => {
  document.getElementById("cartModal").style.display = "none";
});

// Open cart on icon click
document.getElementById("cartIcon").addEventListener("click", () => {
  document.getElementById("cartModal").style.display = "flex";
});

let cart = [];

function updateCart() {
  const cartList = document.getElementById("cartItems");
  const totalPrice = document.getElementById("totalPrice");
  cartList.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ₱${item.price}`;
    cartList.appendChild(li);
    total += parseFloat(item.price);
  });

  totalPrice.textContent = "₱" + total.toFixed(2);
}

document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.getAttribute("data-name");
    const price = button.getAttribute("data-price");

    cart.push({ name, price });
    updateCart();

    const countEl = document.getElementById("cartCount");
    countEl.textContent = cart.length;

    // Show modal after adding item
    document.getElementById("cartModal").style.display = "flex";
  });
});

// Checkout button action: print receipt
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Generate receipt HTML content
  let receiptContent = `
    <html>
      <head><title>Receipt</title></head>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { text-align: center; }
        ul { list-style: none; padding-left: 0; }
        li { margin-bottom: 8px; }
        .total { font-weight: bold; margin-top: 15px; }
        .footer { margin-top: 30px; text-align: center; font-size: 0.9em; color: #666; }
      </style>
      <body>
        <h2>Cozy Brews Receipt</h2>
        <p>Date: ${new Date().toLocaleString()}</p>
        <ul>
  `;

  let total = 0;
  cart.forEach(item => {
    receiptContent += `<li>${item.name} - ₱${item.price}</li>`;
    total += parseFloat(item.price);
  });

  receiptContent += `
        </ul>
        <div class="total">Total: ₱${total.toFixed(2)}</div>
        <div class="footer">
          Thank you for visiting Cozy Brews!<br/>
          ☕ Come again soon!
        </div>
      </body>
    </html>
  `;

  // Create a hidden iframe to print from
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "1px";
  iframe.style.height = "1px";
  iframe.style.top = "-9999px";
  document.body.appendChild(iframe);

  const iframeWindow = iframe.contentWindow || iframe.contentDocument.defaultView;
  iframe.contentDocument.open();
  iframe.contentDocument.write(receiptContent);
  iframe.contentDocument.close();

  iframe.onload = () => {
    iframeWindow.focus();
    iframeWindow.print();
    iframeWindow.close();
    document.body.removeChild(iframe);

    // Clear cart after checkout
    cart = [];
    updateCart();
    document.getElementById("cartCount").textContent = "0";
    document.getElementById("cartModal").style.display = "none";
  };
});