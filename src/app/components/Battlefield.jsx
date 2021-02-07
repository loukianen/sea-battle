import React from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';
import _ from 'lodash';
import * as actions from '../actions/index';

const isValidCoords = (coordsList, maxValue) => {
  if (_.isEmpty(coordsList)) {
    return false;
  }
  for (const { x, y } of coordsList) {
    if (x < 1 || x > maxValue || y < 1 || y > maxValue) {
      return false;
    }
  }
  return true;
};

const isPutingPosible = (area, ship, field) => {
  const coords = [...area, ...ship];
  for (const cell of coords) {
    const { x, y } = cell;
    const style = field[y][x].style;
    console.log(cell);
    if (style === 'ship-wrong' || style === 'ship-area-wrong') {
      return false;
    }
  }
  return true;
}

const getAreaCoords = (ship, maxValue) => {
  const area = ship.getArea();
  return area.filter((item) => isValidCoords([item], maxValue));
}

const mapStateToProps = (state) => {
  const {
    language,
    userField,
    enemyField,
    shipInMove,
  } = state;
  const props = {
    language,
    userField,
    enemyField,
    shipInMove,
  };
  return props;
};

const actionCreators = {
  changeCells: actions.changeCells,
  setDefaultStyleForCells: actions.setDefaultStyleForCells,
  putShipIntoUserDock: actions.putShipIntoUserDock,
  returnShipIntoDock: actions.returnShipIntoDock,
};

class Battlefield extends React.Component {
  handlerDragEnter = (mainPoint) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { shipInMove,  dispatch, changeCells, userField } = this.props;
    shipInMove.setCoords(mainPoint);
    const shipCoords = shipInMove.getCoords();
    const shipArea = shipInMove.getArea();
    const maxCoordValue = userField.length - 1;
    // for every cell { coords, options: [['style', new style], ['value', new value]] }
    const shipCoordsData = _.compact(shipCoords.map((coords) => {
      if (isValidCoords([coords], maxCoordValue)) {
        const { x, y } = coords;
        const style = _.isNull(userField[y][x].shipId) ? 'ship' : 'ship-wrong';
        return { coords, options: [['style', style]] };
      }
      return null;
    }));
    const areaCoordsData = _.compact(shipArea.map((coords) => {
        if (isValidCoords([coords], maxCoordValue)) {
          const { x, y } = coords;
          const style = _.isNull(userField[y][x].shipId) ? 'ship-area' : 'ship-area-wrong';
        return { coords, options: [['style', style]] };
        }
        return null;
      }));
    dispatch(changeCells([...shipCoordsData, ...areaCoordsData]));
  }

  handlerDragLeave = (mainPoint) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {
      shipInMove,
      userField,
      dispatch,
      changeCells,
    } = this.props;

    const curCoords = [...shipInMove.getCoords(), ...shipInMove.getArea()];
    const oldCoordsOfShip = shipInMove.calcCoords(mainPoint);
    const oldCoordsOfArea = shipInMove.calcArea(oldCoordsOfShip);
    const oldCoords = [...oldCoordsOfShip, ...oldCoordsOfArea];
    const maxCoordValue = userField.length - 1;

    const coordsForCleaning = _.isEqual(curCoords, oldCoords)
      ? curCoords
      : _.differenceWith(oldCoords, curCoords, _.isEqual);

    const validCoordsForCleaning = coordsForCleaning
      .filter((coords) => isValidCoords([coords], maxCoordValue))
      .map((coords) => {
        const { x, y } = coords;
        return _.isNull(userField[y][x].shipId)
          ? { coords, options: [['style', userField[y][x].defaultStyle]] }
          : { coords, options: [['style', 'ship']] };
      });
    dispatch(changeCells(_.compact(validCoordsForCleaning)));
  }

  handlerDrop = () => (e) => {
    const {
      shipInMove,
      userField,
      dispatch,
      putShipIntoUserDock,
      returnShipIntoDock,
    } = this.props;
    const maxCoordValue = userField.length - 1;
    const coordsOfShip = _.isNull(shipInMove) ? [] : shipInMove.getCoords();
    const coordsOfArea = _.isNull(shipInMove) ? [] : getAreaCoords(shipInMove, maxCoordValue);
    if (isValidCoords(coordsOfShip, maxCoordValue)
      && isPutingPosible(coordsOfArea, coordsOfShip, userField)) {
      // for every cell { id: cellId, options: [['style', new style], ['value', new value]] }
      const shipData = coordsOfShip.map((coords) => ({
        coords,
        options: [['style', 'ship'], ['shipId', shipInMove.getId()]],
        })
      );
      const areaData = coordsOfArea
      .map((coords) => {
        const { x, y } = coords;
        return _.isNull(userField[y][x].shipId)
          ? { coords, options: [['style', userField[y][x].defaultStyle]] }
          : { coords, options: [['style', 'ship']] };
      });
      const data = { coords: [...shipData, ...areaData], ship: shipInMove, };
      dispatch(putShipIntoUserDock(data));
    } else {
      const data = {
        coords: [...coordsOfShip, ...coordsOfArea]
          .filter((coords) => isValidCoords([coords], maxCoordValue))
          .map((coords) => {
            const { x, y } = coords;
            return _.isNull(userField[y][x].shipId)
              ? { coords, options: [['style', userField[y][x].defaultStyle]] }
              : { coords, options: [['style', 'ship']] };
          }),
        ship: shipInMove,
      };
      console.log(`else: ${JSON.stringify(data)}`);
      dispatch(returnShipIntoDock(data));
    }
  }

  handlerDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const { owner } = this.props;
    const flotId = `${owner}Flot`;
    const fieldId = `${owner}Field`;
    const field = this.props[fieldId];
    return(
      <div className="field-container">
        <div className="text-center color-ship-border h3" id={flotId}>{i18next.t(`ui.${flotId}`)}</div>
        <div className="col field rounded mb-3 grid-11" id={fieldId}>
          {_.flatten(field.map((line, lineIndex) => {
            return line.map((cell, cellIndex) => {
              const { id, style, coords } = cell;
              const stateValue = cell.value;
              const cellValue = stateValue !== null && typeof stateValue !=='number'
                ? i18next.t(`field.${stateValue}`)
                : stateValue;
              return owner === 'user' && lineIndex !== 0 && cellIndex !== 0
                ? (<div
                    key={id}
                    className={style}
                    onDragLeave={this.handlerDragLeave(coords)}
                    onDragEnter={this.handlerDragEnter(coords)}
                    onDrop={this.handlerDrop(coords)}
                    onDragOver={this.handlerDragOver}
                  >{cellValue}</div>)
               : (<div key={id} className={style}>{cellValue}</div>);
            });
          }))}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(Battlefield);