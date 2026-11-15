function goMenu() {
  window.location.href = "menu.html";
}

function openMenu(selectedCategory) {
  let appetizerSection = document.getElementById("appetizers");
  let pizzaSection = document.getElementById("pizza");
  let pastaSection = document.getElementById("pasta");
  let dessertSection = document.getElementById("desserts");
  let drinkSection = document.getElementById("drinks");

  let appetizerBtn = document.getElementById("btnAppetizers");
  let pizzaBtn = document.getElementById("btnPizza");
  let pastaBtn = document.getElementById("btnPasta");
  let dessertBtn = document.getElementById("btnDesserts");
  let drinkBtn = document.getElementById("btnDrinks");

  if (!appetizerSection) return;

  appetizerSection.classList.add("hidden");
  pizzaSection.classList.add("hidden");
  pastaSection.classList.add("hidden");
  dessertSection.classList.add("hidden");
  drinkSection.classList.add("hidden");

  appetizerBtn.classList.remove("active");
  pizzaBtn.classList.remove("active");
  pastaBtn.classList.remove("active");
  dessertBtn.classList.remove("active");
  drinkBtn.classList.remove("active");

  if (selectedCategory === "appetizers") {
    appetizerSection.classList.remove("hidden");
    appetizerBtn.classList.add("active");
  } else if (selectedCategory === "pizza") {
    pizzaSection.classList.remove("hidden");
    pizzaBtn.classList.add("active");
  } else if (selectedCategory === "pasta") {
    pastaSection.classList.remove("hidden");
    pastaBtn.classList.add("active");
  } else if (selectedCategory === "desserts") {
    dessertSection.classList.remove("hidden");
    dessertBtn.classList.add("active");
  } else if (selectedCategory === "drinks") {
    drinkSection.classList.remove("hidden");
    drinkBtn.classList.add("active");
  }
}

let totalPrice = 0;
let cartList = [];
let currentItem = null;

function addToCart(itemName, itemPrice) {
  let existingItem = cartList.find((item) => item.name === itemName);

  if (existingItem) {
    existingItem.qty += 1;
    currentItem = existingItem;
    showPopUp(true);
  } else {
    let newItem = { name: itemName, price: itemPrice, qty: 1 };
    cartList.push(newItem);
    currentItem = newItem;
    showPopUp(false);
  }

  updateCartDisplay();
}

function showPopUp(isEditMode) {
  const popUp = document.getElementById("cartPopUp");
  const title = document.getElementById("popUpTitle");
  const itemNameDisplay = document.getElementById("popUpItemName");
  const qtyDisplay = document.getElementById("popUpQty");

  if (!popUp) return;

  popUp.classList.remove("hidden");
  itemNameDisplay.innerText = currentItem.name;
  qtyDisplay.innerText = currentItem.qty;

  if (isEditMode) {
    title.innerHTML = "Want to edit your cart?<br>Update quantity.";
  } else {
    title.innerHTML = "Perfect choice.<br>Added to your order.";
  }
}

function closePopUp() {
  const popUp = document.getElementById("cartPopUp");
  if (popUp) popUp.classList.add("hidden");
}

function updateQty(change) {
  if (!currentItem) return;

  let newQty = currentItem.qty + change;

  if (newQty > 0) {
    currentItem.qty = newQty;
    document.getElementById("popUpQty").innerText = currentItem.qty;
    updateCartDisplay();
  } else if (newQty === 0) {
    cartList = cartList.filter((item) => item.name !== currentItem.name);
    closePopUp();
    updateCartDisplay();
  }
}

function updateCartDisplay() {
  const cartItemsElement = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");

  totalPrice = 0;

  if (cartItemsElement) {
    cartItemsElement.innerHTML = "";
  }

  for (let i = 0; i < cartList.length; i++) {
    let item = cartList[i];
    let itemTotal = item.price * item.qty;
    totalPrice += itemTotal;

    if (cartItemsElement) {
      cartItemsElement.innerHTML += `<li>${item.name} (x${item.qty}) - $${itemTotal}</li>`;
    }
  }

  if (totalPriceElement) {
    totalPriceElement.innerText = totalPrice;
  }

  localStorage.setItem("savedCart", JSON.stringify(cartList));
  localStorage.setItem("savedTotal", totalPrice);
}

function goToCheckout() {
  updateCartDisplay();
  alert("Redirecting to checkout page... Total your order is $" + totalPrice);
  window.location.href = "order.html";
}

window.onload = function () {
  let savedCart = localStorage.getItem("savedCart");

  if (savedCart) {
    cartList = JSON.parse(savedCart);
  }

  updateCartDisplay();
};

const btnEwallet = document.getElementById("btnEwallet");
const btnTransfer = document.getElementById("btnTransfer");
const bankMenu = document.getElementById("bankMenu");
const ewalletMenu = document.getElementById("ewalletMenu");

if (btnEwallet && btnTransfer) {
  btnEwallet.addEventListener("click", function () {
    btnEwallet.classList.add("activeTab");
    btnTransfer.classList.remove("activeTab");

    ewalletMenu.classList.remove("hidden");
    bankMenu.classList.add("hidden");
  });

  btnTransfer.addEventListener("click", function () {
    btnTransfer.classList.add("activeTab");
    btnEwallet.classList.remove("activeTab");

    bankMenu.classList.remove("hidden");
    ewalletMenu.classList.add("hidden");
  });
}

const radioPickup = document.getElementById("pickup");
const radioDelivery = document.getElementById("delivery");
const addressContainer = document.getElementById("addressContainer");

if (radioPickup && radioDelivery) {
  radioPickup.addEventListener("change", function () {
    if (this.checked) {
      addressContainer.classList.add("hidden");
    }
  });

  radioDelivery.addEventListener("change", function () {
    if (this.checked) {
      addressContainer.classList.remove("hidden");
    }
  });
}
function validateForm(event) {
  event.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const phoneNumber = document.getElementById("phoneNumber").value.trim();
  const paymentOptions = document.getElementsByName("paymentOption");

  const isDelivery = document.getElementById("delivery").checked;
  const addressValue = document.getElementById("address").value.trim();

  if (isDelivery && addressValue === "") {
    alert(
      "Validation Failed: You selected Delivery, please provide your delivery address!",
    );
    return false;
  }

  const isPickup = document.getElementById("pickup").checked;
  if (!isDelivery && !isPickup) {
    alert(
      "Validation Failed: Please select an Order Type (Pick-Up or Delivery)!",
    );
    return false;
  }
  if (cartList.length === 0) {
    alert("Your order summary is empty! Please select at least 1 menu item.");
    return false;
  }

  if (fullName === "" || phoneNumber === "") {
    alert("Full Name and Phone Number must be filled!");
    return false;
  }

  if (isNaN(phoneNumber)) {
    alert("Phone Number must contain only numbers!");
    return false;
  }

  if (phoneNumber.length < 10) {
    alert("Phone Number must be at least 10 digits long!");
    return false;
  }

  let isPaymentSelected = false;

  for (let i = 0; i < paymentOptions.length; i++) {
    if (paymentOptions[i].checked) {
      isPaymentSelected = true;
      break;
    }
  }

  if (!isPaymentSelected) {
    alert("Please select a payment method (e.g., GoPay or ShopeePay)!");
    return false;
  }

  alert("Success! Your order has been placed. Grand Total: $" + totalPrice);

  localStorage.removeItem("savedCart");
  localStorage.removeItem("savedTotal");
  cartList = [];
  updateCartDisplay();

  window.location.href = "index.html";
}

function clearCart() {
  if (cartList.length === 0) {
    alert("Your cart is already empty!");
    return;
  }

  let confirmClear = confirm(
    "Are you sure you want to clear all items from your cart?",
  );

  if (confirmClear) {
    cartList = [];
    localStorage.removeItem("savedCart");
    localStorage.removeItem("savedTotal");

    updateCartDisplay();
  }
}
