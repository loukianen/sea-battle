import React from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';
// import * as actions from '../actions/index';

const mapStateToProps = (state) => {
  const {
    language,
    userCells,
    userCellIds,
    enemyCells,
    enemyCellIds,
  } = state;
  const props = {
    language,
    userCells,
    userCellIds,
    enemyCells,
    enemyCellIds,
  };
  return props;
};

/* const actionCreators = {
  battleField: actions.battleField,
};*/

class Battlefield extends React.Component {
  render() {
    const { owner } = this.props;
    const cells = this.props[`${owner}Cells`];
    const cellIds = this.props[`${owner}CellIds`];
    const flotId = `${owner}Flot`;
    const fieldId = `${owner}Field`;
    return(
      <div className="field-container">
        <div className="text-center color-ship-border h3" id={flotId}>{i18next.t(`ui.${flotId}`)}</div>
        <div className="col field rounded mb-3 grid-11" id={fieldId}>
          {cellIds.map((id) => {
            const stateValue = cells[id].value;
            const cellValue = stateValue !== null && typeof stateValue !=='number'
              ? i18next.t(`field.${stateValue}`)
              : stateValue;
            return (<div key={id} className={cells[id].style}>{cellValue}</div>);
          })}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Battlefield);