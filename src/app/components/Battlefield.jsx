import React from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';
import * as actions from '../actions/index';

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

const actionCreators = {
  changeCells: actions.changeCells,
  setDefaultStyleForCells: actions.setDefaultStyleForCells,
};

class Battlefield extends React.Component {
  handlerDragEnter = (id) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    // for every cell { id: cellId, options: [['style', new style], ['value', new value]] }
    const data = [{ id, options: [['style', 'ship']] }];
    const { dispatch, changeCells } = this.props;
    dispatch(changeCells(data));
  }

  handlerDrop = (id) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    // for every cell { id: cellId, options: [['style', new style], ['value', new value]] }
    const data = [{ id, options: [['style', 'ship']] }];
    const { dispatch, changeCells } = this.props;
    dispatch(changeCells(data));
  }

  handlerDragOver = () => (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  handlerDragLeave = (id) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const data = [id]; // [ ...ids of cells]
    const { dispatch, setDefaultStyleForCells } = this.props;
    dispatch(setDefaultStyleForCells(data));
  }

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
            return owner === 'user' && cells[id].coordinates !== null
              ? (<div
                  key={id}
                  className={cells[id].style}
                  onDragLeave={this.handlerDragLeave(id)}
                  onDragEnter={this.handlerDragEnter(id)}
                  onDrop={this.handlerDrop(id)}
                  onDragOver={this.handlerDragOver(id)}
                >{cellValue}</div>)
              : (<div key={id} className={cells[id].style}>{cellValue}</div>);
          })}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(Battlefield);