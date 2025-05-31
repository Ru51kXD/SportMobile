// src/data/BonusStorage.js

const bonusStorage = {
  balance: 1200,
  history: [
    { id: 1, type: 'earn', amount: 200, date: '2024-06-01', desc: 'Покупка билета: UFC 301' },
    { id: 2, type: 'earn', amount: 100, date: '2024-06-03', desc: 'Приглашение друга' },
    { id: 3, type: 'spend', amount: 150, date: '2024-06-10', desc: 'Скидка на билет' },
    { id: 4, type: 'earn', amount: 300, date: '2024-06-15', desc: 'Покупка билета: NBA Finals' },
    { id: 5, type: 'earn', amount: 50, date: '2024-06-18', desc: 'Оставлен отзыв' },
  ],
  getBalance() {
    return this.balance;
  },
  getHistory() {
    return this.history.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  add(amount, desc) {
    this.balance += amount;
    this.history.unshift({
      id: Date.now(),
      type: 'earn',
      amount,
      date: new Date().toISOString().split('T')[0],
      desc,
    });
  },
  spend(amount, desc) {
    this.balance = Math.max(0, this.balance - amount);
    this.history.unshift({
      id: Date.now(),
      type: 'spend',
      amount,
      date: new Date().toISOString().split('T')[0],
      desc,
    });
  },
};

export default bonusStorage; 