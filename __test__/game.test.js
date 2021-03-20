import _ from 'lodash';
import generateFieldData from '../src/app/bin/genFieldData';
import Game from '../src/app/bin/Game';
import JackSparrow from '../src/app/bin/JackSparrow';
import Ushakov from '../src/app/bin/Ushakov';
import Nahimov from '../src/app/bin/Nahimov';
import OneDeckShip from '../src/app/ships/OneDeckShip';
import DoubleDeckShip from '../src/app/ships/DoubleDeckShip';
import FakeEnemyForGetShoot from '../__fixtures__/FakeEnemyForGetShoot';
import { isValidField, calcShips } from '../src/app/bin/utils';

const makeDataForTest = () => {
  const field = generateFieldData();
  const firstShip = new OneDeckShip(1);
  firstShip.setCoords({ x: 5, y: 1 });
  const secondShip = new DoubleDeckShip(2);
  secondShip.setCoords({ x: 2, y: 1 });
  const flot = { ships: { 1: firstShip, 2: secondShip }, shipIds: [1, 2] };
  flot.shipIds.forEach((id) => {
    const coords = flot.ships[id].getCoords();
    coords.forEach(({ x, y }) => {
      const cell = field[y][x];
      cell.style = 'ship';
      cell.shipId = id;
    });
  });
  const shoots = [
    { x: 1, y: 1 }, // empty sell
    { x: 2, y: 1 }, // wounded
    { x: 3, y: 1 }, // killed
    { x: 5, y: 1 }, // killed + won
  ];
  return { field, flot, shoots };
};

const gameOptions = { fieldSize: 'ten', enemy: 'ushakov', shipType: 'line' };
const jacksGameOptions = { fieldSize: 'ten', enemy: 'jackSparrow', shipType: 'line' };
const nahimovGameOptions = { fieldSize: 'ten', enemy: 'nahimov', shipType: 'line' };

const { shoots, flot, field } = makeDataForTest();

const expectedRecords = [
  [['offTarget']],
  [['wounded']],
  [['killed', [{ x: 2, y: 1 }, { x: 3, y: 1 }]]],
  [['killed', [{ x: 5, y: 1 }]], ['won', _.cloneDeep(field)]],
];

test('new game', () => {
  const game = new Game(gameOptions);
  const jacksGame = new Game(jacksGameOptions);
  const nahimovGame = new Game(nahimovGameOptions);

  expect(nahimovGame.enemy).toBeInstanceOf(Nahimov);
  expect(jacksGame.enemy).toBeInstanceOf(JackSparrow);
  expect(game.enemy).toBeInstanceOf(Ushakov);
  expect(game.enemyFlot.shipIds.length).toBe(10);
  expect(Object.keys(game.enemyFlot.ships).length).toBe(10);
  expect(isValidField(game.enemyMap)).toBeTruthy();
  expect(calcShips(game.enemyMap)).toBe(10);
  expect(game.userFlot).toEqual({ ships: {}, shipIds: [] });
  expect(game.userMap).toEqual([]);
});

test('start', () => {
  const game1 = new Game(gameOptions);

  const dataUserStarted = { userField: _.cloneDeep(field), userFlot: _.cloneDeep(flot) };
  const actionResultUserStarted = game1.start(dataUserStarted, () => 'user');
  const expectRecordUserStarted = [['user', null, 'started']];

  expect(actionResultUserStarted).toEqual(expectRecordUserStarted);

  const game2 = new Game(gameOptions);
  const enemy2 = new FakeEnemyForGetShoot(shoots.slice(0, 1));
  enemy2.setEnemyField(_.cloneDeep(field));
  game2.setEnemy(enemy2);

  const dataEnemyStarted = { userField: _.cloneDeep(field), userFlot: _.cloneDeep(flot) };
  const actionResultEnemyStarted = game2.start(dataEnemyStarted, () => 'enemy');
  const expectRecordEnemyStarted = [['enemy', null, 'started']];

  expect(actionResultEnemyStarted).toEqual(expectRecordEnemyStarted);
});

const dataForHandleUserShoots = _.zip(shoots, expectedRecords);
const gameForUserShoot = new Game(gameOptions);
gameForUserShoot.setEnemyMap(_.cloneDeep(field));
gameForUserShoot.setEnemyFlot(_.cloneDeep(flot));

test.each(dataForHandleUserShoots)('handle user shoots with shoot %j', (shoot, record) => {
  const shootResult = gameForUserShoot.handleUserShoot(shoot);
  const expectRecord = record
    .map((item) => (item[0] === 'won' ? ['user', null, item[0]] : ['user', shoot, ...item]));
  expect(shootResult).toEqual(expectRecord);
});

const dataForGetEnemyShoot = _.zip(shoots, expectedRecords);
const gameForEnemyShoot = new Game(gameOptions);
gameForEnemyShoot.setUserMap(_.cloneDeep(field));
gameForEnemyShoot.setEnemyMap(_.cloneDeep(field));
gameForEnemyShoot.setUserFlot(_.cloneDeep(flot));

const enemy = new FakeEnemyForGetShoot(shoots);
enemy.setEnemyField(_.cloneDeep(field));
gameForEnemyShoot.setEnemy(enemy);

test.each(dataForGetEnemyShoot)('handle enemy shoots with shoot %j', (shoot, record) => {
  const shootResult = gameForEnemyShoot.getEnemyShoot();
  const expectRecord = record
    .map((item) => (item[0] === 'won' ? ['enemy', null, ...item] : ['enemy', shoot, item[0]]));
  expect(shootResult).toEqual(expectRecord);
});
