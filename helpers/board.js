function generateBoard (board, items) {
  let itemsIndex = -1;
  for (let i = 0; i < board.length; i++) {
    itemsIndex < items.length -1 ? itemsIndex++ : itemsIndex = 0;
    for (let j = 0; j < board.length; j++) {
      itemsIndex < items.length -1 ? itemsIndex++ : itemsIndex = 0;
      if (board[i][j] === 'shelf') board[i][j] = items[itemsIndex];
    }
  }
  return board;
}

module.exports = generateBoard;
