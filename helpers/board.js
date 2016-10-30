function generateBoard (board, items) {
  let itemsIndex = -1;
  const newBoard = [];
  for (let i = 0; i < board.length; i++) {
    const newRow = [];
    itemsIndex < items.length -1 ? itemsIndex++ : itemsIndex = 0;
    for (let j = 0; j < board.length; j++) {
      const newSquare = {};
      itemsIndex < items.length -1 ? itemsIndex++ : itemsIndex = 0;
      if (board[i][j] === 'shelf') {
        newSquare.item = items[itemsIndex];
      }
      newSquare.active = false;
      newSquare.content = board[i][j];
      newRow.push(newSquare);
    }
    newBoard.push(newRow);
  }
  newBoard[0][1].active = true;
  newBoard[1][0].active = true;
  return newBoard;
}

module.exports = generateBoard;
