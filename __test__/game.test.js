import _ from 'lodash';
import generateFieldData from '../src/app/bin/genFieldData';
import game from '../src/app/bin/game';
import OneDeckShip from '../src/app/ships/OneDeckShip';
import DoubleDeckShip from '../src/app/ships/DoubleDeckShip';
import FakeEnemyForGetShoot from '../__fixtures__/FakeEnemyForGetShoot';

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

const { shoots, flot, field } = makeDataForTest();

const getShootTestData = [
  [[shoots[3], shoots[0]], ['killed', 'offTarget']],
  [shoots.slice(1, 3), ['wounded', 'killed', 'won']],
];

const handleShootTestDataUserWon = [
  [[shoots[1]], ['wounded']],
  [[shoots[2]], ['killed']],
  [[shoots[3]], ['killed', 'won']],
];

let gaugeUserField;
let gaugeUserFlot;
let gaugeEnemyField;
let gaugeEnemyFlot;

beforeEach(() => {
  gaugeUserField = _.cloneDeep(field);
  gaugeUserFlot = _.cloneDeep(flot);
  gaugeEnemyField = _.cloneDeep(field);
  gaugeEnemyFlot = _.cloneDeep(flot);
});

test('getShoot 1 series', () => {
  let enemy = new FakeEnemyForGetShoot(shoots.slice(1));
  enemy.setEnemyField(generateFieldData());

  gaugeUserField[shoots[1].y][shoots[1].x].style = 'killed-ship';
  gaugeUserField[shoots[1].y][shoots[1].x].value = 'X';
  gaugeUserField[shoots[2].y][shoots[2].x].style = 'killed-ship';
  gaugeUserField[shoots[2].y][shoots[2].x].value = 'X';
  gaugeUserField[shoots[3].y][shoots[3].x].style = 'killed-ship';
  gaugeUserField[shoots[3].y][shoots[3].x].value = 'X';

  gaugeUserFlot.ships[1].setHealth(0);
  gaugeUserFlot.ships[2].setHealth(0);

  const shootResult = game(
    'getShoot',
    { enemy, userField: _.cloneDeep(field), userFlot: _.cloneDeep(flot) },
  );
  const { records, userField, userFlot } = shootResult;
  const expectRecord = [
    ['enemy', shoots[1], 'wounded'],
    ['enemy', shoots[2], 'killed'],
    ['enemy', shoots[3], 'killed'],
    ['enemy', null, 'won'],
  ];
  expect(records).toEqual(expectRecord);
  expect(userField).toEqual(gaugeUserField);
  expect(userFlot).toEqual(gaugeUserFlot);
});

test('getShoot 2 series', () => {
  let enemy = new FakeEnemyForGetShoot([shoots[3], shoots[0]]);
  enemy.setEnemyField(generateFieldData());

  gaugeUserField[shoots[3].y][shoots[3].x].style = 'killed-ship';
  gaugeUserField[shoots[3].y][shoots[3].x].value = 'X';
  gaugeUserField[shoots[0].y][shoots[0].x].value = '●';

  gaugeUserFlot.ships[1].setHealth(0);

  const shootResult = game(
    'getShoot',
    { enemy, userField: _.cloneDeep(field), userFlot: _.cloneDeep(flot) },
  );
  const { records, userField, userFlot } = shootResult;
  const expectRecord = [['enemy', shoots[3], 'killed'], ['enemy', shoots[0], 'offTarget']];
  expect(records).toEqual(expectRecord);
  expect(userField).toEqual(gaugeUserField);
  expect(userFlot).toEqual(gaugeUserFlot);
});

test('start', () => {
  const enemy = new FakeEnemyForGetShoot(shoots.slice(0, 1));
  enemy.setEnemyField(generateFieldData());

  const dataUserStarted = { enemy, userField: _.cloneDeep(field), userFlot: _.cloneDeep(flot) };
  const actionResultUserStarted = game('start', dataUserStarted, () => 'user');
  const expectRecordUserStarted = [['user', null, 'started']];

  expect(actionResultUserStarted.records).toEqual(expectRecordUserStarted);
  expect(actionResultUserStarted.userField).toEqual(gaugeUserField);
  expect(actionResultUserStarted.userFlot).toEqual(gaugeUserFlot);

  gaugeUserField[shoots[0].y][shoots[0].x].value = '●';

  const dataEnemyStarted = { enemy, userField: _.cloneDeep(field), userFlot: _.cloneDeep(flot) };
  const actionResultEnemyStarted = game('start', dataEnemyStarted, () => 'enemy');
  const expectRecordEnemyStarted = [
    ['enemy', null, 'started'],
    ['enemy', _.head(shoots), 'offTarget'],
  ];

  expect(actionResultEnemyStarted.records).toEqual(expectRecordEnemyStarted);
  expect(actionResultEnemyStarted.userField).toEqual(gaugeUserField);
  expect(actionResultEnemyStarted.userFlot).toEqual(gaugeUserFlot);
});

test('handleShoot user off target', () => {
  const shoot = _.head(shoots);
  const enemy = new FakeEnemyForGetShoot(shoots.slice(0, 1));
  enemy.setEnemyField(generateFieldData());

  gaugeEnemyField[shoots[0].y][shoots[0].x].value = '●';
  gaugeUserField[shoots[0].y][shoots[0].x].value = '●';

  const data = {
    enemy,
    userField: _.cloneDeep(field),
    userFlot: _.cloneDeep(flot),
    shoot,
    enemyField: _.cloneDeep(field),
    enemyFlot: _.cloneDeep(flot),
  };
  const shootingResult = game('handleShoot', data);
  const expectRecord = [['user', shoot, 'offTarget'], ['enemy', shoot, 'offTarget']];
  
  expect(shootingResult.records).toEqual(expectRecord);
  expect(shootingResult.enemyField).toEqual(gaugeEnemyField);
  expect(shootingResult.enemyFlot).toEqual(gaugeEnemyFlot);
  expect(shootingResult.userField).toEqual(gaugeUserField);
  expect(shootingResult.userFlot).toEqual(gaugeUserFlot);
});
/*
test.each(handleShootTestDataUserWon)('(handleShoot user won, %j, %j)', (seriesShoots, expRecResults) => {
  const enemy = new FakeEnemyForGetShoot(shoots.slice(0, 1));
  const shoot = _.head(seriesShoots);
  const data = {
    enemy,
    userData: userDataForHandleShoot,
    shoot,
    enemyData: enemyDataForHandleShoot,
  };
  const shootResult = game('handleShoot', data);
  const expectRecord = expRecResults.map((result, index) => {
    const coords = seriesShoots[index] ? seriesShoots[index] : null;
    return ['user', coords, result];
  });
  expect(shootResult).toEqual(expectRecord);
});*/
