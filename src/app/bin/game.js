import _ from 'lodash';
import { getRandomElFromColl } from './utils';

const isPlayerWon = (competitorFlot) => {
  const { ships, shipIds } = competitorFlot;
  const totalHealth = shipIds.reduce((acc, id) => acc + ships[id].getHealth(), 0);
  return totalHealth <= 0;
};

const isPlayerHitShip = (records) => {
  const lastRecord = _.last(records);
  const lastResult = _.last(lastRecord);
  return ['wounded', 'killed'].includes(lastResult);
};

const game = (action, state, randomizer = getRandomElFromColl) => {
  const functionMapping = {
    start: (data) => {
      const whoStarts = randomizer(['user', 'enemy']);
      const shoots = whoStarts === 'enemy' ? game('getShoot', data) : null;
      return [[whoStarts, null, 'started'], ..._.compact(shoots)];
    },
    handleShoot: ({ shoot, enemyData: { enemyField, enemyFlot } }) => {
      const { x, y } = shoot;
      const { style, shipId } = enemyField[y][x];
      const result = style === 'ship' ? enemyFlot.ships[shipId].hit() : 'offTarget';
      const winnerRecord = isPlayerWon(enemyFlot) ? ['user', null, 'won'] : null;
      return _.compact([['user', { x, y }, result], winnerRecord]);
    },
    getShoot: ({ enemy, userData: { userField, userFlot } }) => {
      const iter = (records = []) => {
        const { x, y } = enemy.shoot();
        const { style, shipId } = userField[y][x];
        const result = style === 'ship' ? userFlot.ships[shipId].hit() : 'offTarget';
        const winnerRecord = isPlayerWon(userFlot) ? ['enemy', null, 'won'] : null;
        const res = [...records, ..._.compact([['enemy', { x, y }, result], winnerRecord])];
        return res;
      };
      const curRecord = iter();
      return isPlayerHitShip(curRecord) ? iter(curRecord) : curRecord;
    },
  };
  return functionMapping[action]
    ? functionMapping[action](state)
    : new Error('Unknown action');
};

export default game;
