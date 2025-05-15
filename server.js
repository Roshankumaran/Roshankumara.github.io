// Run this backend with Node.js
// Save as server.js and run: node server.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Sample data
let accounts = [
  {
    id: 'checking',
    name: 'Checking Account',
    accountNumber: '1234567890',
    balance: 5432.10,
  },
  {
    id: 'savings',
    name: 'Savings Account',
    accountNumber: '0987654321',
    balance: 12345.67,
  },
  {
    id: 'credit',
    name: 'Credit Card',
    cardNumber: '**** **** **** 4321',
    availableCredit: 3200.0,
  },
];

let transactions = [
  {
    id: 1,
    date: '2024-06-15',
    description: 'Grocery Store Purchase',
    type: 'debit',
    amount: -123.45,
    status: 'Completed',
    accountId: 'checking',
  },
  {
    id: 2,
    date: '2024-06-14',
    description: 'Salary Deposit',
    type: 'credit',
    amount: 3000.0,
    status: 'Completed',
    accountId: 'checking',
  },
  {
    id: 3,
    date: '2024-06-13',
    description: 'Electricity Bill Payment',
    type: 'debit',
    amount: -150.0,
    status: 'Completed',
    accountId: 'checking',
  },
  {
    id: 4,
    date: '2024-06-12',
    description: 'Online Transfer to Savings',
    type: 'transfer',
    amount: -500.0,
    status: 'Completed',
    accountId: 'checking',
  },
  {
    id: 5,
    date: '2024-06-11',
    description: 'Coffee Shop',
    type: 'debit',
    amount: -4.75,
    status: 'Completed',
    accountId: 'checking',
  },
  {
    id: 6,
    date: '2024-06-10',
    description: 'Refund from Online Store',
    type: 'credit',
    amount: 45.0,
    status: 'Completed',
    accountId: 'checking',
  },
  {
    id: 7,
    date: '2024-06-09',
    description: 'Gym Membership',
    type: 'debit',
    amount: -60.0,
    status: 'Completed',
    accountId: 'checking',
  },
  {
    id: 8,
    date: '2024-06-08',
    description: 'Transfer from Checking',
    type: 'transfer',
    amount: 500.0,
    status: 'Completed',
    accountId: 'savings',
  },
  {
    id: 9,
    date: '2024-06-07',
    description: 'Restaurant Dinner',
    type: 'debit',
    amount: -85.2,
    status: 'Completed',
    accountId: 'checking',
  },
  {
    id: 10,
    date: '2024-06-06',
    description: 'Mobile Phone Bill',
    type: 'debit',
    amount: -75.0,
    status: 'Completed',
    accountId: 'checking',
  },
];

// GET all accounts
app.get('/api/accounts', (req, res) => {
  res.json(accounts);
});

// GET transactions (optionally filtered by accountId)
app.get('/api/transactions', (req, res) => {
  const { accountId } = req.query;
  if (accountId) {
    const filtered = transactions.filter(
      (t) => t.accountId === accountId
    );
    res.json(filtered);
  } else {
    res.json(transactions);
  }
});

// POST transfer funds
app.post('/api/transfer', (req, res) => {
  const { fromAccount, toAccount, amount } = req.body;

  if (
    !fromAccount ||
    !toAccount ||
    !amount ||
    typeof amount !== 'number' ||
    amount <= 0
  ) {
    return res.status(400).json({ error: 'Invalid transfer data' });
  }

  // Find from and to accounts
  const fromAcc = accounts.find((a) => a.id === fromAccount);
  const toAcc = accounts.find(
    (a) => a.accountNumber === toAccount || a.id === toAccount
  );

  if (!fromAcc) {
    return res.status(404).json({ error: 'From account not found' });
  }
  if (!toAcc) {
    return res.status(404).json({ error: 'To account not found' });
  }

  // Check sufficient funds for checking and savings accounts
  if (
    (fromAcc.id === 'checking' || fromAcc.id === 'savings') &&
    fromAcc.balance < amount
  ) {
    return res.status(400).json({ error: 'Insufficient funds' });
  }

  // Perform transfer
  if (fromAcc.balance !== undefined) {
    fromAcc.balance -= amount;
  }
  if (toAcc.balance !== undefined) {
    toAcc.balance += amount;
  }

  // Add transactions for both sides
  const now = new Date().toISOString().split("T")[0];
  const newTransactionFrom = {
    id: transactions.length + 1,
    date: now,
    description: `Transfer to ${toAcc.name || toAcc.accountNumber}`,
    type: 'transfer',
    amount: -amount,
    status: 'Completed',
    accountId: fromAcc.id,
  };
  const newTransactionTo = {
    id: transactions.length + 2,
    date: now,
    description: `Transfer from ${fromAcc.name}`,
    type: 'transfer',
    amount: amount,
    status: 'Completed',
    accountId: toAcc.id,
  };
  transactions.push(newTransactionFrom, newTransactionTo);

  res.json({
    message: 'Transfer completed successfully',
    fromAccount: fromAcc,
    toAccount: toAcc,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Banking backend API running on http://localhost:${PORT}`);
});
