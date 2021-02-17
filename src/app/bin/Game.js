import _ from 'lodash';
import generateFieldData from './genFieldData';
import makeFlot from './makeFlot';
import { getFieldSize, getRandomElFromColl } from './utils';
import Ushakov from './Ushakov';

const getEnemy = (enemyName) => {
  switch (enemyName) {
    case 'ushakov':
      return new Ushakov();
    default:
      throw new Error('Unknown enemy name');
  }
};

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

class Game {
  constructor(gameOptions) {
    this.enemy = getEnemy(gameOptions.enemy);
    const newField = generateFieldData(getFieldSize(gameOptions.fieldSize));
    const newFlot = makeFlot(gameOptions);
    const { ships, shipIds, field } = this.enemy.setFlot(newField, newFlot);
    this.enemyFlot = { ships, shipIds };
    this.enemyMap = field;
    this.userFlot = { ships: {}, shipIds: [] };
    this.userMap = [];
  }

  handleUserShoot(userShoot) {
    const { x, y } = userShoot;
    const { shipId } = this.getEnemyMap()[y][x];
    let result = 'offTarget';
    if (shipId !== null) {
      result = this.enemyFlot.ships[shipId].hit();
    }
    const winnerRecord = isPlayerWon(this.getEnemyFlot()) ? ['user', null, 'won'] : null;
    if (result === 'offTarget') {
      const enemyShootResults = this.getEnemyShoot();
      const records = [['user', { x, y }, result], ...enemyShootResults];
      return records;
    }
    const res = _.compact([['user', { x, y }, result], winnerRecord]);
    return res;
  }

  getEnemyFlot() {
    return this.enemyFlot;
  }

  getEnemyMap() {
    return this.enemyMap;
  }

  getEnemyShoot() {
    const iter = (previousRecords = []) => {
      const { x, y } = this.enemy.shoot();
      const { shipId } = this.getUserMap()[y][x];
      let result = 'offTarget';
      if (shipId !== null) {
        result = this.userFlot.ships[shipId].hit();
      }
      this.enemy.handleSootingResult({ coords: { x, y }, result });
      const winnerRecord = isPlayerWon(this.getUserFlot()) ? ['enemy', null, 'won'] : null;
      const curRecord = [
        ...previousRecords,
        ..._.compact([['enemy', { x, y }, result], winnerRecord]),
      ];
      return isPlayerHitShip(curRecord) ? iter(curRecord) : curRecord;
    };
    return iter();
  }

  getUserFlot() {
    return this.userFlot;
  }

  getUserMap() {
    return this.userMap;
  }

  setEnemy(enemy) {
    this.enemy = enemy;
  }

  setEnemyFlot(flot) {
    this.enemyFlot = flot;
  }

  setEnemyMap(field) {
    this.enemyMap = field;
  }

  setUserFlot(flot) {
    this.userFlot = flot;
  }

  setUserMap(field) {
    this.userMap = field;
  }

  start({ userField, userFlot }, randomizer = getRandomElFromColl) {
    this.userMap = userField;
    this.userFlot = userFlot;
    const whoStarts = randomizer(['user', 'enemy']);
    const startRecord = [whoStarts, null, 'started'];
    if (whoStarts === 'enemy') {
      const enemyShootRecords = this.getEnemyShoot();
      return [startRecord, ...enemyShootRecords];
    }
    return [startRecord];
  }
}

export default Game;
