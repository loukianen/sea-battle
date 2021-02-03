import _ from 'lodash';
import OneDeckShip from '../ships/OneDeckShip';
import DoubleDeckShip from '../ships/DoubleDeckShip';
import ThreeDeckLineShip from '../ships/ThreeDeckLineShip';
import FourDeckLineShip from '../ships/FourDeckLineShip';

const flotMapping = {
  tenline: [
    ['fourDeck', FourDeckLineShip, 1],
    ['threeDeck', ThreeDeckLineShip, 2],
    ['doubleDeck', DoubleDeckShip, 3],
    ['oneDeck', OneDeckShip, 4],
  ],
  threeline: [
    ['fourDeck', FourDeckLineShip, 0],
    ['threeDeck', ThreeDeckLineShip, 0],
    ['doubleDeck', DoubleDeckShip, 0],
    ['oneDeck', OneDeckShip, 1],
  ],
};

export default (gameOptions) => {
  const { fieldSize, shipType } = gameOptions;
  const flotType = `${fieldSize}${shipType}`;
  const ships = _.flatten(flotMapping[flotType].map((item) => {
    const [shipClass, Unit, amount] = item;
    return Array(amount).fill(null)
      .map(() => new Unit(_.uniqueId(shipClass)));
  }));
  const data = ships.reduce((acc, ship) => {
    const id = ship.getId();
    acc.shipIds.push(id);
    const newShips = { ...acc.ships, [id]: ship };
    acc.ships = newShips;
    return acc;
  }, { ships: {}, shipIds: [] });
  return data;
};
