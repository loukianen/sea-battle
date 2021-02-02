import _ from 'lodash';

const generateFirtCellsRow = (ids) => {
  const letters = [null, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  const res = ids.reduce(
    (acc, id, index) => {
      const cell = {
        [id]: {
          id,
          style: 'cell',
          defaultStyle: 'cell',
          value: letters[index],
          coordinates: null,
        },
      };
      return { ...acc, ...cell };
    }, {},
  );
  return res;
};

const generateCellsRow = (ids, styles, number) => {
  const cellsRow = ids.reduce((acc, id, index) => {
    const coordinates = index < 1 ? null : { x: index - 1, y: number - 1 };
    const cell = {
      [id]: {
        id,
        style: styles[index],
        defaultStyle: styles[index],
        value: index === 0 ? number : null,
        coordinates,
      },
    };
    return { ...acc, ...cell };
  }, {});
  return cellsRow;
};

const generateRestCellsRows = (idsList) => {
  const amountOfMiddleElements = idsList[0].length - 3; // 3 = number, first end last column
  const stylesMapping = {
    first: ['cell', 'cell-top-left', ...Array(amountOfMiddleElements).fill('cell-top'), 'cell-top-right'],
    middle: ['cell', 'cell-left', ...Array(amountOfMiddleElements).fill('cell-inside'), 'cell-right'],
    last: ['cell', 'cell-bottom-left', ...Array(amountOfMiddleElements).fill('cell-bottom'), 'cell-bottom-right'],
  };
  const restCellsRows = idsList.reduce((acc, ids, index) => {
    let styles;
    switch (index) {
      case 0:
        styles = stylesMapping.first;
        break;
      case idsList.length - 1:
        styles = stylesMapping.last;
        break;
      default:
        styles = stylesMapping.middle;
        break;
    }
    const cellsRow = generateCellsRow(ids, styles, index + 1); // (index + 1) is header of row
    return { ...acc, ...cellsRow };
  }, {});
  return restCellsRows;
};

export default (battleFieldSize = 10) => {
  if (battleFieldSize < 3) {
    return {};
  }
  const fieldSize = battleFieldSize > 10 ? 11 : battleFieldSize + 1;
  const cellIds = Array(fieldSize ** 2).fill(null).map((el, index) => index + 1);
  const rowFromCellIds = _.chunk(cellIds, fieldSize);
  const firstRowIds = _.head(rowFromCellIds);
  const restRowIds = _.tail(rowFromCellIds);
  const cells = { ...generateFirtCellsRow(firstRowIds), ...generateRestCellsRows(restRowIds) };
  return { cells, cellIds };
};
