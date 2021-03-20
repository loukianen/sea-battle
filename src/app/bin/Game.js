import _ from 'lodash';
import generateFieldData from './genFieldData';
import makeFlot from './makeFlot';
import { getFieldSize, getRandomElFromColl } from './utils';
import JackSparrow from './JackSparrow';
import Ushakov from './Ushakov';
import Nahimov from './Nahimov';

const getEnemy = (enemyName) => {
  switch (enemyName) {
    case 'jackSparrow':
      return new JackSparrow();
    case 'ushakov':
      return new Ushakov();
    case 'nahimov':
      return new Nahimov();
    default:
      throw new Error('Unknown enemy name');
  }
};

const isPlayerWon = (competitorFlot) => {
  const { ships, shipIds } = competitorFlot;
  const totalHealth = shipIds.reduce((acc, id) => acc + ships[id].getHealth(), 0);
  return totalHealth <= 0;
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
    // ship coords for render area around killed ship for user
    const curRecord = result === 'killed'
      ? ['user', { x, y }, result, this.enemyFlot.ships[shipId].getCoords()]
      : ['user', { x, y }, result];
    const winnerRecord = isPlayerWon(this.getEnemyFlot()) ? ['user', null, 'won'] : null;
    const res = _.compact([curRecord, winnerRecord]);
    return res;
  }

  getEnemyFlot() {
    return this.enemyFlot;
  }

  getEnemyMap() {
    return this.enemyMap;
  }

  getEnemyShoot() {
    const { x, y } = this.enemy.shoot();
    const { shipId } = this.getUserMap()[y][x];
    let result = 'offTarget';
    if (shipId !== null) {
      result = this.userFlot.ships[shipId].hit();
    }
    this.enemy.handleSootingResult({ coords: { x, y }, result });
    // enemy map for render not killed enemy ship for user
    const winnerRecord = isPlayerWon(this.getUserFlot())
      ? ['enemy', null, 'won', this.getEnemyMap()] : null;
    const finalyRecord = _.compact([['enemy', { x, y }, result], winnerRecord]);
    return finalyRecord;
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
    return [startRecord];
  }
}

export default Game;
