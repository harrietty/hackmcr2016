const items = require('../items');
const numOfItems = items.length;
const maxOrderSize = 5;

function generateOrder () {
  const order = [];
  const orderSize = Math.ceil(Math.random() * maxOrderSize);

  let randomItemIndex;
  for (let i = 0; i < orderSize; i++) {
    randomItemIndex = Math.floor(Math.random() * numOfItems);
    if (order.indexOf(items[randomItemIndex]) === -1) order.push(items[randomItemIndex]);
  }
  return order;
}

function generateOrders (num) {
  const orders = [];
  for (let i = 0; i < num; i++) {
    orders.push(generateOrder());
  }
  return orders;
}

module.exports = {generateOrder, generateOrders};
