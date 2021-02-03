import React from 'react';
import i18next from 'i18next';

const shipPart = <div className="ship cell30x30 rounded"></div>;

export default class Flot extends React.Component {
  handleDragstart = (e) => {
    const text = 'Hi!'; // e.target.getAttribute('key');
    
    e.dataTransfer.effectAllowed = "move";
    //e.dataTransfer.setData('text', 'Hello, guys!');
    // console.log(`From handleDragstart: ${e.dataTransfer.getData('text')}`);
  }
  
  render() {
    return (
      <div className="d-flex flex-column shipsfield text-center rounded">
        <h5 className="mt-2 color-ship-border">{i18next.t('shipsTable.header')}</h5>
        <table className="table table-borderless color-ship-border">
          <tbody>
            {[4, 3, 2, 1].map((item) => (<tr key={item}>
              <td>
                <div  className="d-flex flex-row" draggable="true" onDragStart={this.handleDragstart}>
                  {Array(item).fill(shipPart)}
                </div>
              </td>
              <td>{5 - item}</td>
              <td>{i18next.t('shipsTable.unit')}</td>
            </tr>))}
          </tbody>
        </table>
      </div>
    );
  }
}