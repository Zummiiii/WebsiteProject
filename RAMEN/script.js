// Toggle mobile menu
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("navMenu").classList.toggle("active");
});

// Close mobile menu when clicking outside
document.addEventListener("click", (event) => {
  const navMenu = document.getElementById("navMenu");
  const hamburger = document.getElementById("hamburger");
  if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
    navMenu.classList.remove("active");
  }
});

// Auto-close nav menu when a link is clicked
document.querySelectorAll("#navMenu a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navMenu").classList.remove("active");
  });
});

// Cart logic
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

// Add items to cart
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.getAttribute("data-name");
    const price = parseFloat(button.getAttribute("data-price"));

    cart.push({ name, price });
    updateCart();

    document.getElementById("cartModal").style.display = "flex";
  });
});

// Close cart modal
document.getElementById("closeCart").addEventListener("click", () => {
  document.getElementById("cartModal").style.display = "none";
});

// Open cart modal
document.getElementById("cartIcon").addEventListener("click", () => {
  document.getElementById("cartModal").style.display = "flex";
});

// Checkout: Print receipt (mobile-friendly)
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const customer = document.getElementById('customer')?.value || 'N/A';
  const date = document.getElementById('date')?.value || new Date().toISOString().split('T')[0];
  const amountPaid = document.getElementById('amountPaid')?.value || '0';
  const change = document.getElementById('change')?.value || '0';

  let receiptContent = `
    <html>
    <head>
      <title>Receipt</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; padding: 10px; width: 80mm; }
        h2 { text-align: center; font-size: 18px; }
        ul { list-style: none; padding: 0; font-size: 14px; }
        li { margin-bottom: 4px; }
        .total { font-weight: bold; margin-top: 10px; }
        .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #444; }
      </style>
    </head>
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
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  // Open receipt in a new tab and print
  const printWindow = window.open('', '_blank');
  printWindow.document.open();
  printWindow.document.write(receiptContent);
  printWindow.document.close();

  // Reset cart
  cart = [];
  updateCart();
  document.getElementById("cartModal").style.display = "none";
});
