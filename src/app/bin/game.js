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
      const startRecord = [whoStarts, null, 'started'];
      if (whoStarts === 'enemy') {
        const { records, enemy, userField, userFlot } = game('getShoot', data);
        return { records: [startRecord, ...records], enemy, userField, userFlot };
      }
      return { records: [startRecord], ...data };
    },
    handleShoot: (gameData) => {
      const {
        shoot,
        enemyField,
        enemyFlot,
        userField,
        userFlot,
        enemy,
      } = gameData;
      const { x, y } = shoot;
      const { shipId } = enemyField[y][x];
      enemyField[y][x].value = '●';
      let result = 'offTarget';
      if (shipId !== null) {
        result = enemyFlot.ships[shipId].hit();
        if (result === 'wounded' || result === 'killed') {
          enemyField[y][x].style = 'killed-ship';
          enemyField[y][x].value = 'X';
        }
      }
      const winnerRecord = isPlayerWon(enemyFlot) ? ['user', null, 'won'] : null;
      if (result === 'offTarget') {
        const enemyShootResults = game('getShoot', { enemy, userField, userFlot });
        const records = [['user', { x, y }, result], ...enemyShootResults.records];
        return {
          records,
          enemy: enemyShootResults.enemy,
          enemyField,
          enemyFlot,
          userField: enemyShootResults.userField,
          userFlot: enemyShootResults.userFlot,
        };
      }
      const res = _.compact([['user', { x, y }, result], winnerRecord]);
      return {
        records: res,
        enemy,
        enemyField,
        enemyFlot,
        userField,
        userFlot,
      };
    },
    getShoot: (gameData) => {
      const iter = (data, rec = []) => {
        const { enemy, userField, userFlot } = data;
        const { x, y } = enemy.shoot();
        const { shipId } = userField[y][x];
        userField[y][x].value = '●';
        let result = 'offTarget';
        if (shipId !== null) {
          result = userFlot.ships[shipId].hit();
          if (result === 'wounded' || result === 'killed') {
            userField[y][x].style = 'killed-ship';
            userField[y][x].value = 'X';
          }
        }
        enemy.handleSootingResult({ coords: { x, y }, result });
        const winnerRecord = isPlayerWon(userFlot) ? ['enemy', null, 'won'] : null;
        const curRecord = [...rec, ..._.compact([['enemy', { x, y }, result], winnerRecord])];
        return isPlayerHitShip(curRecord)
          ? iter ({ enemy, userField, userFlot }, curRecord)
          : { records: curRecord, enemy, userField, userFlot };
      };
      return iter(gameData);
    },
  };
  return functionMapping[action]
    ? functionMapping[action](state)
    : new Error('Unknown action');
};

export default game;
