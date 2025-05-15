let currentUser = null;
let balance = 5000;

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (username === "user" && password === "pass") {
    currentUser = username;
    document.getElementById("login-section").style.display = "none";
    document.getElementById("banking-dashboard").style.display = "block";
    document.getElementById("user-name").innerText = currentUser;
  } else {
    document.getElementById("login-message").innerText = "Invalid credentials!";
  }
}

function deposit() {
  const amount = parseFloat(document.getElementById("deposit-amount").value);
  if (amount > 0) {
    balance += amount;
    updateBalance();
  } else {
    alert("Enter a valid deposit amount.");
  }
}

function withdraw() {
  const amount = parseFloat(document.getElementById("withdraw-amount").value);
  if (amount > 0 && amount <= balance) {
    balance -= amount;
    updateBalance();
  } else {
    alert("Invalid or insufficient balance.");
  }
}

function updateBalance() {
  document.getElementById("balance").innerText = balance.toFixed(2);
}

function logout() {
  currentUser = null;
  document.getElementById("banking-dashboard").style.display = "none";
  document.getElementById("login-section").style.display = "block";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("login-message").innerText = "";
}
