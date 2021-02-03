import Ushakov from '../src/app/bin/Ushakov';

const ai = new Ushakov();

const isValidField = (battleField) => {
  for (let col = 0; col < battleField.length; col += 1) {
    for (let row = 1; row < battleField.length; row += 1) {
      if (battleField[row][col] && battleField[row][col].type === 'ship') {
        if (battleField[row - 1][col + 1].type === 'ship'
          || battleField[row - 1][col - 1].type === 'ship') {
          return false;
        }
      }
    }
  }
  return true;
};

const calcShipsCount = (battleField) => {
  const shipIds = new Set();
  const fieldSize = battleField.length;
  for (let row = 0; row < fieldSize; row += 1) {
    for (let col = 0; col < fieldSize; col += 1) {
      const currentCell = battleField[row][col];
      if (currentCell.type === 'ship') {
        shipIds.add(currentCell.shipId);
      }
    }
  }
  return shipIds.size;
};

test('setting 10 ships on field 10x10', () => {
  const field = ai.setFlot();
  expect(isValidField(field)).toBeTruthy();
  expect(calcShipsCount(field)).toBe(10);
});
