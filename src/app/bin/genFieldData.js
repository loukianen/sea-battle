const generateFirstRow = (size) => {
  const letters = [null, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  const values = letters.slice(0, size);
  let currentId = 1;
  const row = values.map((value, index) => {
    const cell = {
      id: currentId,
      style: 'cell',
      defaultStyle: 'cell',
      value,
      coords: { x: index, y: 0 },
    };
    currentId += 1;
    return cell;
  });
  return row;
};

const generateRow = (styles, number) => {
  let currentId = number * 100 + 1;
  const row = styles.map((style, index) => {
    const coords = { x: index, y: number };
    const cell = {
      id: currentId,
      style,
      defaultStyle: style,
      value: index === 0 ? number : null,
      coords,
    };
    currentId += 1;
    return cell;
  });
  return row;
};

const generateRestRows = (size) => {
  const amountOfMiddleElements = size - 3; // 3 = number, first end last column
  const stylesMapping = {
    first: ['cell', 'cell-top-left', ...Array(amountOfMiddleElements).fill('cell-top'), 'cell-top-right'],
    middle: ['cell', 'cell-left', ...Array(amountOfMiddleElements).fill('cell-inside'), 'cell-right'],
    last: ['cell', 'cell-bottom-left', ...Array(amountOfMiddleElements).fill('cell-bottom'), 'cell-bottom-right'],
  };
  let counter = size - 1;
  const lineNumbers = Array(size - 1)
    .fill(size)
    .map((number) => {
      const newNumber = number - counter;
      counter -= 1;
      return newNumber;
    });
  const rows = lineNumbers.map((number, index) => {
    let styles;
    switch (index) {
      case 0:
        styles = stylesMapping.first;
        break;
      case lineNumbers.length - 1:
        styles = stylesMapping.last;
        break;
      default:
        styles = stylesMapping.middle;
        break;
    }
    const row = generateRow(styles, number);
    return row;
  });
  return rows;
};

export default (battleFieldSize = 10) => {
  if (battleFieldSize < 3) {
    return [];
  }
  const fieldSize = battleFieldSize > 10 ? 11 : battleFieldSize + 1;
  const field = [generateFirstRow(fieldSize), ...generateRestRows(fieldSize)];
  return field;
};
