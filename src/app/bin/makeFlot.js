import OneDeckShip from '../ships/OneDeckShip';
import DoubleDeckShip from '../ships/DoubleDeckShip';
import ThreeDeckLineShip from '../ships/ThreeDeckLineShip';
import FourDeckLineShip from '../ships/FourDeckLineShip';

const flotMapping = {
  tenline: [
    ['fourDeckShips', FourDeckLineShip, 1],
    ['threeDeckShips', ThreeDeckLineShip, 2],
    ['doubleDeckShips', DoubleDeckShip, 3],
    ['oneDeckShips', OneDeckShip, 4],
  ],
  threeline: [
    ['fourDeckShips', FourDeckLineShip, 0],
    ['threeDeckShips', ThreeDeckLineShip, 0],
    ['doubleDeckShips', DoubleDeckShip, 0],
    ['oneDeckShips', OneDeckShip, 1],
  ],
};

export default (gameOptions) => {
  const { fieldSize, shipType } = gameOptions;
  const flotType = `${fieldSize}${shipType}`;
  return flotMapping[flotType].reduce(
    (acc, item) => {
      const [shipClass, unit, amount] = item;
      const shipsOfClass = { [shipClass]: Array(amount)
        .fill(null)
        .map((el, index) => new unit(`${shipClass}${index}`)) };
      return { ...acc, ...shipsOfClass };
    }, {},
  );
};