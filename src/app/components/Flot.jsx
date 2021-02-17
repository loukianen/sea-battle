import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';
import shipClasses from '../ships/shipClasses';
import * as actions from '../actions/index';

const generateDefaultDocksOrientation = () => shipClasses.reduce(
  (acc, shipClass) => ({ ...acc, [shipClass]: 'east' }), {},
);

const putShipsInDock = (flot) => {
  const dock = shipClasses.reduce(
    (acc, shipClass) => ({ ...acc, [shipClass]: [] }), {},
  );
  const { ships, shipIds } = flot;
  shipIds.forEach((id) => {
    const curShipClass = ships[id].getClass();
    dock[curShipClass].push(ships.id);
  });
  return dock;
};

const getDockStyle = (isDockEmpty) => {
  if (isDockEmpty) {
    return <div className="emptyDock cell30x30 rounded"></div>;
  }
  return <div className="ship cell30x30 rounded"></div>;
};

const chooseShipId = (className, flot) => {
  const { ships, shipIds } = flot;
  for (const id of shipIds) {
    if (ships[id].getClass() === className) {
      return id;
    }
  }
};

const actionCreators = {
  takeShipOutDock: actions.takeShipOutDock,
  returnShipIntoDock: actions.returnShipIntoDock,
};

const mapStateToProps = (state) => {
  const { language, flot, gameState, shipInMove } = state;
  const props = { language, flot, gameState, shipInMove };
  return props;
};

class Flot extends React.Component {
  constructor() {
    super();
    this.state = { 
      docksOrientation: generateDefaultDocksOrientation(),
    };
  }

  handleDoubleClick = (className) => (e) => {
    e.peventDefault;
    const newState = generateDefaultDocksOrientation();
    const orientation = this.state.docksOrientation[className] === 'east' ? 'north' : 'east';
    newState[className] = orientation;
    this.setState({ docksOrientation: newState });
  }

  handleDragstart = (className) => (e) => {
    e.dataTransfer.dropEffect = 'none';
    e.dataTransfer.effectAllowed = 'copy';
    const { dispatch, takeShipOutDock, flot } = this.props;
    const shipId = chooseShipId(className, flot);
    const ship = flot.ships[shipId];
    ship.setOrientation(this.state.docksOrientation[className]);
    dispatch(takeShipOutDock(ship));
  }

  handleDragEnd = (e) => {
    e.preventDefault();
    const { returnShipIntoDock, shipInMove, dispatch } = this.props;
    const data = { coords: [], ship: shipInMove };
    dispatch(returnShipIntoDock(data));
  }

  render() {
    const { flot, gameState } = this.props;
    const dock = putShipsInDock(flot);
    return (
      <div className="d-flex flex-column shipsfield justify-content-center text-center rounded">
        <h5 className="mt-2 color-ship-border">{i18next.t('shipsTable.header')}</h5>
        <table className="table table-borderless color-ship-border">
          <tbody>
            {shipClasses.map((className, index) => {
              const amountOfShips = dock[className].length;
              const isDockEmpty = amountOfShips === 0;
              const dockClasses = this.state.docksOrientation[className] === 'north'
                ? 'd-flex flex-column'
                : 'd-flex flex-row';
              const dockDesign = Array(shipClasses.length - index).fill(getDockStyle(isDockEmpty));
              return (<tr key={className}>
                <td>
                  {gameState !== 'settingFlot'
                    ? <div className={dockClasses} onDragEnd={this.handleDragEnd}>{dockDesign}</div>
                    : <div
                        className={dockClasses}
                        draggable="true" onDragStart={this.handleDragstart(className)}
                        onDoubleClick={this.handleDoubleClick(className)}
                        onDragEnd={this.handleDragEnd}
                      >
                        {dockDesign}
                    </div>}
                </td>
                <td>{amountOfShips}</td>
                <td>{i18next.t('shipsTable.unit')}</td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(Flot);
