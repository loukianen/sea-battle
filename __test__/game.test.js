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
const enemyData = { enemyField: _.cloneDeep(field), enemyFlot: _.cloneDeep(flot) };
const userData = { userField: _.cloneDeep(field), userFlot: _.cloneDeep(flot) };
const getShootTestData = [
  [[shoots[3], shoots[0]], ['killed', 'offTarget']],
  [shoots.slice(1, 3), ['wounded', 'killed', 'won']],
];
const handleShootTestData = [
  [[shoots[0]], ['offTarget']],
  [[shoots[1]], ['wounded']],
  [[shoots[2]], ['killed']],
  [[shoots[3]], ['killed', 'won']],
];

test('start', () => {
  const enemy = new FakeEnemyForGetShoot(shoots.slice(0, 1));
  const data = { enemy, userData };
  const actionResultUserStarted = game('start', data, () => 'user');
  const actionResultEnemyStarted = game('start', data, () => 'enemy');
  const expectRecordUserStarted = [['user', null, 'started']];
  const expectRecordEnemyStarted = [
    ['enemy', null, 'started'],
    ['enemy', _.head(shoots), 'offTarget'],
  ];
  expect(expectRecordUserStarted).toEqual(actionResultUserStarted);
  expect(expectRecordEnemyStarted).toEqual(actionResultEnemyStarted);
});

test.each(handleShootTestData)('(handleShoot, %j, %j)', (seriesShoots, expRecResults) => {
  const shootResult = game('handleShoot', { shoot: _.head(seriesShoots), enemyData });
  const expectRecord = expRecResults.map((result, index) => {
    const coords = seriesShoots[index] ? seriesShoots[index] : null;
    return ['user', coords, result];
  });
  expect(shootResult).toEqual(expectRecord);
});

test.each(getShootTestData)('(getShoot, %j, %j)', (seriesShoots, expRecResults) => {
  const enemy = new FakeEnemyForGetShoot(seriesShoots);
  const shootResult = game('getShoot', { enemy, userData });
  const expectRecord = expRecResults.map((result, index) => {
    const coords = seriesShoots[index] ? seriesShoots[index] : null;
    return ['enemy', coords, result];
  });
  expect(shootResult).toEqual(expectRecord);
});
