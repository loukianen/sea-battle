import genField from '../src/app/bin/genFieldData';
import { cells3, cellIds3 } from '../__fixtures__/fieldData';

const data = [
  [genField(3), { cells: cells3, cellIds: cellIds3 }],
  [genField(2), {}],
];

test.each(data)('genFieldData(%#)', (res, expectedRes) => {
  expect(res).toEqual(expectedRes);
});
