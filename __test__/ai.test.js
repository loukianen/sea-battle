import _ from 'lodash';
import Ushakov from '../src/app/bin/Ushakov';
import getFieldData from '../src/app/bin/genFieldData';
import makeFlot from '../src/app/bin/makeFlot';
import * as utils from '../src/app/bin/utils';

const gameOptions = { fieldSize: 'ten', enemy: 'ushakov', shipType: 'line' };
const newField = getFieldData();
const newFlot = makeFlot(gameOptions);

test('setting 10 ships on field 10x10 Ushakov', () => {
  const ai = new Ushakov();
  const { ships, shipIds, field } = ai.setFlot(_.cloneDeep(newField), _.cloneDeep(newFlot));

  const totalHealth = shipIds.reduce((acc, id) => acc + ships[id].getHealth(), 0);
  expect(utils.isValidField(field)).toBeTruthy();
  expect(utils.calcShips(field)).toBe(10);
  expect(totalHealth).toBe(20);
});

const aiForEmpty = new Ushakov();
aiForEmpty.setFlot(_.cloneDeep(newField), _.cloneDeep(newFlot));
const points = [1, 4, 7, 10];
const hitShipResults = _.flatten(points.map((y) => points.map((x) => ({ x, y })))).slice(0, 15);
const controlField = getFieldData();

test.each(hitShipResults)('(shooting at empty cell, %j)', (shoot) => {
  controlField[shoot.y][shoot.x].value = 'progibited';
  const area = utils.calcArea(shoot).filter(
    (item) => utils.isValidCoords(item, 0, controlField.length - 1),
  );
  area.forEach(({ x, y }) => {
    controlField[y][x].value = 'progibited';
  });
  aiForEmpty.handleSootingResult({ coords: shoot, result: 'killed' });
  const enemyShoot = aiForEmpty.shoot();
  expect(controlField[enemyShoot.y][enemyShoot.x].value).toBeNull();
});

const aiForSinkShip = new Ushakov();
aiForSinkShip.setFlot(_.cloneDeep(newField), _.cloneDeep(newFlot));
const emptyFieldCoords = _.flatten(
  aiForSinkShip.getEnemyField().map((line) => line.map((cell) => cell.coords)),
);
const shipCoords = [{ x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 }];
const shipArea = utils.calcArea(shipCoords);
const fildCoordsButSipAndArea = _.difference(emptyFieldCoords, [...shipCoords, ...shipArea]);
const dataForSinkShip = [
  [
    { coords: { x: 5, y: 5 }, result: 'wounded' },
    [{ x: 5, y: 4 }, { x: 6, y: 5 }, { x: 5, y: 6 }, { x: 4, y: 5 }],
  ],
  [
    { coords: { x: 4, y: 5 }, result: 'offTarget' },
    [{ x: 5, y: 4 }, { x: 6, y: 5 }, { x: 5, y: 6 }],
  ],
  [{ coords: { x: 5, y: 6 }, result: 'wounded' }, [{ x: 5, y: 4 }, { x: 5, y: 7 }]],
  [{ coords: { x: 5, y: 7 }, result: 'offTarget' }, [{ x: 5, y: 4 }]],
  [{ coords: { x: 5, y: 4 }, result: 'killed' }, fildCoordsButSipAndArea],
];

test.each(dataForSinkShip)('(sinking of a wounded ship, %j)', (shootingResult, possibleShoots) => {
  aiForSinkShip.handleSootingResult(shootingResult);
  const enemyShoot = aiForSinkShip.shoot();
  expect(possibleShoots).toContainEqual(enemyShoot);
});
