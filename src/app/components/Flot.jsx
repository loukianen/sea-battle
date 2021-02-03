import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';
import shipClasses from '../ships/shipClasses';

const generateDefaultSipsOrientation = () => shipClasses.reduce(
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

const mapStateToProps = (state) => {
  const { language, flot } = state;
  
  const props = { language, flot };
  return props;
};

class Flot extends React.Component {
  constructor() {
    super();
    this.state = { 
      shipsOrientation: generateDefaultSipsOrientation(),
    };
  }

  handleDoubleClick = (className) => (e) => {
    e.peventDefault;
    const newState = generateDefaultSipsOrientation();
    const orientation = this.state.shipsOrientation[className] === 'east' ? 'north' : 'east';
    newState[className] = orientation;
    this.setState({ shipsOrientation: newState });
  }

  handleDragstart = (e) => {
    const text = 'Hi!'; // e.target.getAttribute('key');
    e.dataTransfer.dropEffect = 'none';
    e.dataTransfer.effectAllowed = 'copy';
    //e.dataTransfer.setData('text', 'Hello, guys!');
    // console.log(`From handleDragstart: ${e.dataTransfer.getData('text')}`);
  }
  
  render() {
    const { flot } = this.props;
    const dock = putShipsInDock(flot);
    return (
      <div className="d-flex flex-column shipsfield text-center rounded">
        <h5 className="mt-2 color-ship-border">{i18next.t('shipsTable.header')}</h5>
        <table className="table table-borderless color-ship-border">
          <tbody>
            {!_.isEmpty(flot) > 0 && shipClasses.map((className, index) => {
              const amountOfShips = dock[className].length;
              const isDockEmpty = amountOfShips === 0;
              const dockClasses = this.state.shipsOrientation[className] === 'north'
                ? 'd-flex flex-column'
                : 'd-flex flex-row';
              const dockDesign = Array(shipClasses.length - index).fill(getDockStyle(isDockEmpty));
              return (<tr key={className}>
                <td>
                  {isDockEmpty
                    ? <div className={dockClasses}>{dockDesign}</div>
                    : <div
                        className={dockClasses}
                        draggable="true" onDragStart={this.handleDragstart}
                        onDoubleClick={this.handleDoubleClick(className)}
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

export default connect(mapStateToProps)(Flot);