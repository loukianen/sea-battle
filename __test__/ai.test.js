import _ from 'lodash';
import Ushakov from '../src/app/bin/Ushakov';
import JackSparrow from '../src/app/bin/JackSparrow';
import Nahimov from '../src/app/bin/Nahimov';
import getFieldData from '../src/app/bin/genFieldData';
import makeFlot from '../src/app/bin/makeFlot';
import * as utils from '../src/app/bin/utils';

const gameOptions = { fieldSize: 'ten', enemy: 'ushakov', shipType: 'line' };
const newField = getFieldData();
const newFlot = makeFlot(gameOptions);

const aisForCheckingSettingShipsAndFields = [new Ushakov(), new JackSparrow(), new Nahimov()];

test.each(aisForCheckingSettingShipsAndFields)('setting 10 ships on field 10x10, %s', (ai) => {
  const { ships, shipIds, field } = ai.setFlot(_.cloneDeep(newField), _.cloneDeep(newFlot));

  const totalHealth = shipIds.reduce((acc, id) => acc + ships[id].getHealth(), 0);
  expect(utils.isValidField(field)).toBeTruthy();
  expect(utils.calcShips(field)).toBe(10);
  expect(totalHealth).toBe(20);
});

const aisForEmpty = [new Ushakov(), new JackSparrow(), new Nahimov()];
aisForEmpty.forEach((ai) => {
  ai.setFlot(_.cloneDeep(newField), _.cloneDeep(newFlot));
});
aisForEmpty[2].setEnemyShipsAmount([0, 0, 0, 0]); // prevent specShoot() of Nahimov
const points = [1, 4, 7, 10];
const hitShipResults = _.flatten(points.map((y) => points.map((x) => ({ x, y })))).slice(0, 15);
const controlFields = aisForEmpty.map(() => getFieldData());

test.each(hitShipResults)('(shooting at empty cell, %j)', (shoot) => {
  controlFields.map((item) => {
    const field = item;
    field[shoot.y][shoot.x].value = 'progibited';
    return field;
  });
  const areas = controlFields.map((field) => utils
    .calcArea(shoot)
    .filter((item) => utils.isValidCoords(item, 0, field.length - 1)));
  areas.forEach((area, index) => {
    area.forEach(({ x, y }) => {
      const controlField = controlFields[index];
      controlField[y][x].value = 'progibited';
    });
  });
  aisForEmpty.forEach((ai) => {
    ai.handleSootingResult({ coords: shoot, result: 'killed' });
  });
  const enemyShoots = aisForEmpty.map((ai) => ai.shoot());
  controlFields.forEach((field, index) => {
    const enemyShoot = enemyShoots[index];
    const { x: fieldX, y: fieldY } = enemyShoot;
    expect(field[fieldY][fieldX].value).toBeNull();
  });
});

const aiForSinkShip = new Ushakov();
aiForSinkShip.setFlot(_.cloneDeep(newField), _.cloneDeep(newFlot));
const emptyFieldCoords = _.flatten(
  aiForSinkShip.getEnemyField().map((line) => line.map((cell) => cell.coords)),
);
const shipCoords = [{ x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 }];
const shipArea = utils.calcArea(shipCoords);
const fieldCoordsButShipAndArea = _.difference(emptyFieldCoords, [...shipCoords, ...shipArea]);
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
  [{ coords: { x: 5, y: 4 }, result: 'killed' }, fieldCoordsButShipAndArea],
];

test.each(dataForSinkShip)('(sinking of a wounded ship, %j)', (shootingResult, possibleShoots) => {
  aiForSinkShip.handleSootingResult(shootingResult);
  const enemyShoot = aiForSinkShip.shoot();
  expect(possibleShoots).toContainEqual(enemyShoot);
});

test('handling shooting by Jack', () => {
  const ai = new JackSparrow();
  const field = _.cloneDeep(newField);
  ai.setEnemyField(field);

  const firstShootResult = { coords: { x: 2, y: 1 }, result: 'wounded' };
  ai.handleSootingResult(firstShootResult);
  const fieldAfterFirstShoot = ai.getEnemyField();
  expect(fieldAfterFirstShoot[1][2].style).toBe('ship');
  expect(fieldAfterFirstShoot[2][1].style).toBe('ship-area');
  expect(fieldAfterFirstShoot[2][3].style).toBe('ship-area');

  const secondShootResult = { coords: { x: 3, y: 1 }, result: 'killed' };
  ai.handleSootingResult(secondShootResult);
  const fieldAfterSecondShoot = ai.getEnemyField();
  expect(fieldAfterSecondShoot[1][2].style).toBe('ship');
  expect(fieldAfterSecondShoot[1][3].style).toBe('ship');
  const area = utils
    .calcArea([{ x: 2, y: 1 }, { x: 3, y: 1 }])
    .filter((item) => utils.isValidCoords(item, 1, 10));
  const isStyleAllCellsShipArea = area
    .every(({ x, y }) => fieldAfterSecondShoot[y][x].style === 'ship-area');
  expect(isStyleAllCellsShipArea).toBeTruthy();
});

test('Nahimov make enemyFlot', () => {
  const ai = new Nahimov();
  ai.setFlot(_.cloneDeep(newField), _.cloneDeep(newFlot));
  const shipsAmount = ai.getEnemyShipsAmount();
  shipsAmount.forEach((amount, index) => {
    expect(amount).toBe(index + 1);
  });
});

const nahimovForSpecHand = new Nahimov();
nahimovForSpecHand.setFlot(_.cloneDeep(newField), _.cloneDeep(newFlot));
const shootsResults = [
  [[{ coords: { x: 1, y: 1 }, result: 'killed' }], [1, 2, 3, 3]],
  [
    [{ coords: { x: 3, y: 1 }, result: 'wounded' }, { coords: { x: 4, y: 1 }, result: 'killed' }],
    [1, 2, 2, 3],
  ],
];

test.each(shootsResults)('Nahimov special hendling shoots result, %j, %j', (shootsRes, expectedAmount) => {
  shootsRes.forEach((result) => nahimovForSpecHand.handleSootingResult(result));
  expect(nahimovForSpecHand.getEnemyShipsAmount()).toEqual(expectedAmount);
});

const clearCellIds = [306, 406, 506, 606, 706, 806, 906, 603, 604, 605, 607, 608, 609];
const fieldForNahimovSpecShooting = _.cloneDeep(newField).map((line) => line.map((cell) => {
  if (clearCellIds.includes(cell.id)) {
    return cell;
  }
  const newCell = { ...cell };
  newCell.style = 'ship-area';
  return newCell;
}));

test('Nahimov special shooting', () => {
  const ai = new Nahimov();
  ai.setFlot(_.cloneDeep(newField), _.cloneDeep(newFlot));
  ai.setEnemyField(fieldForNahimovSpecShooting);
  const shoot = ai.shoot();
  expect(shoot).toEqual({ x: 5, y: 6 });
});
