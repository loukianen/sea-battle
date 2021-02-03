import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';

const shipTypes = [
  { typeName: 'fourDeckShips', cellAmount: 4},
  { typeName: 'threeDeckShips', cellAmount: 3},
  { typeName: 'doubleDeckShips', cellAmount: 2},
  { typeName: 'oneDeckShips', cellAmount: 1},
];

const shipPart = {
  notEmpty: <div className="ship cell30x30 rounded"></div>,
  empty: <div className="emptyDock cell30x30 rounded"></div>,
};

const mapStateToProps = (state) => {
  const { language, flot } = state;
  
  const props = { language, flot };
  return props;
};

class Flot extends React.Component {
  constructor() {
    super();
    /*this.shipsOrientation = {
      fourDeckShips: 'east',
      threeDeckShips: 'east',
      doubleDeckShips: 'east',
      oneDeckShips: 'east',
    };*/
    this.state = {
      fourDeckShips: 'east',
      threeDeckShips: 'east',
      doubleDeckShips: 'east',
      oneDeckShips: 'east',
    };
  }

  handleDragstart = (e) => {
    const text = 'Hi!'; // e.target.getAttribute('key');
    
    e.dataTransfer.effectAllowed = "move";
    //e.dataTransfer.setData('text', 'Hello, guys!');
    // console.log(`From handleDragstart: ${e.dataTransfer.getData('text')}`);
  }

  handleDoubleClick = (typeName) => (e) => {
    e.peventDefault;
    console.log(`doubleClick work! TypeName: ${typeName}`);
    const newShipOrientation = this.state[typeName] === 'east' ? 'north' : 'east';
    this.setState({ [typeName]: newShipOrientation });
    console.log(`Changed state: ${this.state[typeName]}`);
  }

export default class Flot extends React.Component {
  handleDragstart = (e) => {
    const text = 'Hi!'; // e.target.getAttribute('key');
    
    e.dataTransfer.effectAllowed = "move";
    //e.dataTransfer.setData('text', 'Hello, guys!');
    // console.log(`From handleDragstart: ${e.dataTransfer.getData('text')}`);
  }
  
  render() {
    const { flot } = this.props;
    return (
      <div className="d-flex flex-column shipsfield text-center rounded">
        <h5 className="mt-2 color-ship-border">{i18next.t('shipsTable.header')}</h5>
        <table className="table table-borderless color-ship-border">
          <tbody>
            {!_.isEmpty(flot) > 0 && shipTypes.map(({ typeName, cellAmount }) => {
              const amountOfShips = flot[typeName].length;
              const dockState = amountOfShips === 0 ? 'empty' : 'notEmpty';
              const dockClasses = this.state[typeName] === 'north'
                ? 'd-flex flex-column'
                : 'd-flex flex-row';
              return (<tr key={typeName}>
                <td onDoubleClick={this.handleDoubleClick(typeName)}>
                  <div className={dockClasses} draggable="true" onDragStart={this.handleDragstart}>
                    {Array(cellAmount).fill(shipPart[dockState])}
                  </div>
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