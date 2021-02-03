import genField from '../src/app/bin/genFieldData';
import gaugeField from '../__fixtures__/fieldData';

const props = ['style', 'defaultStyle', 'value', 'coords'];
const fielsSize = 3;
const field = genField(fielsSize);

test('field size < 3', () => {
  expect(genField(2)).toEqual([]);
});

test('field', () => {
  gaugeField.forEach((line, y) => {
    line.forEach((cell, x) => {
      props.forEach((prop) => {
        expect(field[y][x][prop]).toEqual(cell[prop]);
      });
    });
  });
});

test('uniquest id', () => {
  const ids = new Set();
  field.forEach((line) => {
    line.forEach((cell) => {
      ids.add(cell.id);
    });
  });
  expect(ids.size).toBe((fielsSize + 1) ** 2);
});
