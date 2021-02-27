import _ from 'lodash';
import generateFieldData from '../src/app/bin/genFieldData';
import Game from '../src/app/bin/Game';
import Ushakov from '../src/app/bin/Ushakov';
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

const { shoots, flot, field } = makeDataForTest();

const handleShootTestDataUserWon = [
  [[shoots[1]], ['wounded'], [null]],
  [[shoots[2]], ['killed'], [[{ x: 2, y: 1 }, { x: 3, y: 1 }]]],
  [[shoots[3]], ['killed', 'won'], [[{ x: 5, y: 1 }], null]],
];

test('new game', () => {
  const game = new Game(gameOptions);

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
  const expectRecordEnemyStarted = [
    ['enemy', null, 'started'],
    ['enemy', _.head(shoots), 'offTarget'],
  ];

  expect(actionResultEnemyStarted).toEqual(expectRecordEnemyStarted);
});

test('handleEnemyShoot user off target, enemy won', () => {
  const game = new Game(gameOptions);
  const enemy = new FakeEnemyForGetShoot(shoots.slice(1));
  enemy.setEnemyField(_.cloneDeep(field));
  game.setEnemy(enemy);
  game.setUserMap(_.cloneDeep(field));
  game.setUserFlot(_.cloneDeep(flot));
  game.setEnemyMap(_.cloneDeep(field));
  game.setEnemyFlot(_.cloneDeep(flot));

  const userShoot = _.head(shoots);

  const shootingResult = game.handleUserShoot(userShoot);
  const expectRecord = [
    ['user', userShoot, 'offTarget'],
    ['enemy', shoots[1], 'wounded'],
    ['enemy', shoots[2], 'killed'], // last - ship's coords
    ['enemy', shoots[3], 'killed'],
    ['enemy', null, 'won', _.cloneDeep(field)], // last - enemy's map
  ];

  expect(shootingResult).toEqual(expectRecord);
});

const game3 = new Game(gameOptions);
const enemy3 = new FakeEnemyForGetShoot(shoots.slice(1));
enemy3.setEnemyField(_.cloneDeep(field));
game3.setEnemy(enemy3);
game3.setEnemyMap(_.cloneDeep(field));
game3.setEnemyFlot(_.cloneDeep(flot));

test.each(handleShootTestDataUserWon)(
  '(handleShoot user won, %j, %j)',
  (userShoots, expectResults, additionalData) => {
    const shootResult = game3.handleUserShoot(_.head(userShoots));
    const expectRecord = expectResults.map((result, index) => {
      const coords = userShoots[index] ? userShoots[index] : null;
      return additionalData[index] === null
        ? ['user', coords, result]
        : ['user', coords, result, additionalData[index]];
    });
    expect(shootResult).toEqual(expectRecord);
  },
);
