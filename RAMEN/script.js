// Toggle mobile menu
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("navMenu").classList.toggle("active");
});

// Close mobile menu if user clicks outside of it
document.addEventListener("click", (event) => {
  const navMenu = document.getElementById("navMenu");
  const hamburger = document.getElementById("hamburger");
  if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
    navMenu.classList.remove("active");
  }
});

// Auto-close mobile menu when nav link is clicked
document.querySelectorAll("#navMenu a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navMenu").classList.remove("active");
  });
});

// Close modal
document.getElementById("closeCart").addEventListener("click", () => {
  document.getElementById("cartModal").style.display = "none";
});

// Open cart on icon click
document.getElementById("cartIcon").addEventListener("click", () => {
  document.getElementById("cartModal").style.display = "flex";
});

// Cart data and logic
let cart = [];

function updateCart() {
  const cartList = document.getElementById("cartItems");
  const totalPrice = document.getElementById("totalPrice");
  cartList.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ₱${item.price.toFixed(2)}`;
    cartList.appendChild(li);
    total += item.price;
  });

  totalPrice.textContent = "₱" + total.toFixed(2);
  document.getElementById("cartCount").textContent = cart.length;
}

// Add to cart button logic
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.getAttribute("data-name");
    const price = parseFloat(button.getAttribute("data-price"));

    cart.push({ name, price });
    updateCart();

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

  const customer = document.getElementById('customer')?.value || 'N/A';
  const date = document.getElementById('date')?.value || new Date().toISOString().split('T')[0];
  const amountPaid = document.getElementById('amountPaid')?.value || '0';
  const change = document.getElementById('change')?.value || '0';

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
        <h2>OKINA ONAKA</h2>
        <p>Date: ${new Date().toLocaleString()}</p>
        <ul>
  `;

  let total = 0;
  cart.forEach(item => {
    receiptContent += `<li>${item.name} - ₱${item.price.toFixed(2)}</li>`;
    total += item.price;
  });

  receiptContent += `
        </ul>
        <div class="total">Total: ₱${total.toFixed(2)}</div>
        <div class="total">Amount Paid: ₱${amountPaid}</div>
        <div class="total">Change: ${change}</div>
        <div class="footer">
          Thank you for visiting OKINA ONAKA<br/>
          Come again soon!
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

  const iframeDoc = iframe.contentWindow || iframe.contentDocument;
  iframeDoc.document.open();
  iframeDoc.document.write(receiptContent);
  iframeDoc.document.close();

  // Trigger print after a short delay
  setTimeout(() => {
    iframe.focus();
    iframe.contentWindow.print();
    document.body.removeChild(iframe);

    // Clear cart after checkout
    cart = [];
    updateCart();
    document.getElementById("cartModal").style.display = "none";
  }, 500);
});
