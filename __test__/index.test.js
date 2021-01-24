import genField from '../src/app/bin/genFieldData';

const cells3 = {
  1: {
    id: 1,
    style: 'cell',
    value: null,
    coordinates: null,
  },
  2: {
    id: 2,
    style: 'cell',
    value: 'a',
    coordinates: null,
  },
  3: {
    id: 3,
    style: 'cell',
    value: 'b',
    coordinates: null,
  },
  4: {
    id: 4,
    style: 'cell',
    value: 'c',
    coordinates: null,
  },
  5: {
    id: 5,
    style: 'cell',
    value: 1,
    coordinates: null,
  },
  6: {
    id: 6,
    style: 'cell-top-left',
    value: null,
    coordinates: { x: 0, y: 0 },
  },
  7: {
    id: 7,
    style: 'cell-top',
    value: null,
    coordinates: { x: 1, y: 0 },
  },
  8: {
    id: 8,
    style: 'cell-top-right',
    value: null,
    coordinates: { x: 2, y: 0 },
  },
  9: {
    id: 9,
    style: 'cell',
    value: 2,
    coordinates: null,
  },
  10: {
    id: 10,
    style: 'cell-left',
    value: null,
    coordinates: { x: 0, y: 1 },
  },
  11: {
    id: 11,
    style: 'cell-inside',
    value: null,
    coordinates: { x: 1, y: 1 },
  },
  12: {
    id: 12,
    style: 'cell-right',
    value: null,
    coordinates: { x: 2, y: 1 },
  },
  13: {
    id: 13,
    style: 'cell',
    value: 3,
    coordinates: null,
  },
  14: {
    id: 14,
    style: 'cell-bottom-left',
    value: null,
    coordinates: { x: 0, y: 2 },
  },
  15: {
    id: 15,
    style: 'cell-bottom',
    value: null,
    coordinates: { x: 1, y: 2 },
  },
  16: {
    id: 16,
    style: 'cell-bottom-right',
    value: null,
    coordinates: { x: 2, y: 2 },
  },
};
const cellIds3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const data = [
  [genField(3), { cells: cells3, cellIds: cellIds3 }],
  [genField(2), {}],
];

test.each(data)('genFieldData(%#)', (res, expectedRes) => {
  expect(res).toEqual(expectedRes);
});
