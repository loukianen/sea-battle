import React from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';
import _ from 'lodash';
import * as actions from '../actions/index';
import game from '../bin/game';
import { calcArea, isValidCoords } from '../bin/utils';

const isPutingPosible = (area, ship, field) => {
  const coords = [...area, ...ship];
  for (const cell of coords) {
    const { x, y } = cell;
    const style = field[y][x].style;
    // console.log(cell);
    if (style === 'ship-wrong' || style === 'ship-area-wrong') {
      return false;
    }
  }
  return true;
}

const getAreaCoords = (ship, maxValue) => {
  const area = ship.getArea();
  return area.filter((item) => isValidCoords(item, 1, maxValue));
}

const mapStateToProps = (state) => {
  const {
    activePlayer,
    language,
    userField,
    userFlot,
    enemy,
    enemyField,
    enemyFlot,
    enemyMap,
    shipInMove,
  } = state;
  const props = {
    activePlayer,
    language,
    userField,
    userFlot,
    enemy,
    enemyField,
    enemyFlot,
    enemyMap,
    shipInMove,
  };
  return props;
};

const actionCreators = {
  changeCells: actions.changeCells,
  setDefaultStyleForCells: actions.setDefaultStyleForCells,
  putShipIntoUserDock: actions.putShipIntoUserDock,
  returnShipIntoDock: actions.returnShipIntoDock,
  shoot: actions.shoot,
};

class Battlefield extends React.Component {
  makeDataForChange (data, styleRight, styleWrong) {
    // for every cell { coords, options: [['style', new style], ['value', new value]] }
    const { userField } = this.props;
    const maxCoordValue = userField.length - 1;
    return _.compact(data.map((coords) => {
      if (isValidCoords(coords, 1, maxCoordValue)) {
        const { x, y } = coords;
        const style = _.isNull(userField[y][x].shipId) ? styleRight : styleWrong;
        return { coords, options: [['style', style]] };
      }
      return null;
    }));
  }

  makeDataForClean(data) {
    const { userField } = this.props;
    return data.map((coords) => {
      const { x, y } = coords;
      return _.isNull(userField[y][x].shipId)
        ? { coords, options: [['style', userField[y][x].defaultStyle]] }
        : { coords, options: [['style', 'ship']] };
    });
  }
  
  handlerDragEnter = (mainPoint) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { shipInMove,  dispatch, changeCells } = this.props;
    shipInMove.setCoords(mainPoint);
    const shipCoords = shipInMove.getCoords();
    const shipArea = shipInMove.getArea();
    const shipCoordsData = this.makeDataForChange(shipCoords, 'ship', 'ship-wrong');
    const areaCoordsData = this.makeDataForChange(shipArea, 'ship-area', 'ship-area-wrong');
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
    const oldCoordsOfArea = calcArea(oldCoordsOfShip);
    const oldCoords = [...oldCoordsOfShip, ...oldCoordsOfArea];
    const maxCoordValue = userField.length - 1;

    const coordsForCleaning = _.isEqual(curCoords, oldCoords)
      ? curCoords
      : _.differenceWith(oldCoords, curCoords, _.isEqual);

    const validCoordsForCleaning = coordsForCleaning
      .filter((coords) => isValidCoords(coords, 1, maxCoordValue));

    dispatch(changeCells(this.makeDataForClean(validCoordsForCleaning)));
  }

  handlerDrop = () => () => {
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

    if (isValidCoords(coordsOfShip, 1, maxCoordValue)
      && isPutingPosible(coordsOfArea, coordsOfShip, userField)) {
      // for every cell { id: cellId, options: [['style', new style], ['value', new value]] }
      const shipData = coordsOfShip.map((coords) => ({
        coords,
        options: [['style', 'ship'], ['shipId', shipInMove.getId()]],
        })
      );
      const areaData = this.makeDataForClean(coordsOfArea);
      const data = { coords: [...shipData, ...areaData], ship: shipInMove, };
      dispatch(putShipIntoUserDock(data));
    } else {
      const validCoordsForCleaning = [...coordsOfShip, ...coordsOfArea]
        .filter((coords) => isValidCoords(coords, 1, maxCoordValue));
      const data = {
        coords: this.makeDataForClean(validCoordsForCleaning),
        ship: shipInMove,
      };
      dispatch(returnShipIntoDock(data));
    }
  }

  handlerDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  handleClick = (coords) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {
      shoot,
      dispatch,
      enemy,
      enemyMap,
      enemyFlot,
      userField,
      userFlot,
    } = this.props;
    const enemyData = { enemyField: enemyMap, enemyFlot };
    const userData = { userField, userFlot };
    const records = game('handleShoot', { shoot: coords, enemyData, enemy, userData });
    console.log(JSON.stringify(records));
    dispatch(shoot({ records }));
  }

  renderHeaderCell(cell, cellValue) {
    const { id, style } = cell;
    return (<div key={id} className={style}>{cellValue}</div>);
  }

  renderEnemyFieldCell(cell, cellValue) {
    const { activePlayer } = this.props;
    const { id, style, coords } = cell;
    const handler = activePlayer === 'user' ? this.handleClick(coords) : null;
    return (<div key={id} className={style} onClick={handler}>{cellValue}</div>);
  }

  renderUserFieldCell(cell, cellValue) {
    const { id, style, coords } = cell;
    return (
      <div
        key={id}
        className={style}
        onDragLeave={this.handlerDragLeave(coords)}
        onDragEnter={this.handlerDragEnter(coords)}
        onDrop={this.handlerDrop(coords)}
        onDragOver={this.handlerDragOver}
      >
        {cellValue}
      </div>);
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
              const { value } = cell;
              const cellValue = typeof value ==='string' ? i18next.t(`field.${value}`) : value;
              if (lineIndex === 0 || cellIndex === 0) {
                return this.renderHeaderCell(cell, cellValue);
              }
              return owner === 'user'
                ? this.renderUserFieldCell(cell, cellValue)
                : this.renderEnemyFieldCell(cell, cellValue);
            });
          }))}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(Battlefield);