import React from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';
import _ from 'lodash';
import * as actions from '../actions/index';

const mapStateToProps = (state) => {
  const {
    language,
    userField,
    enemyField,
  } = state;
  const props = {
    language,
    userField,
    enemyField,
  };
  return props;
};

const actionCreators = {
  changeCells: actions.changeCells,
  setDefaultStyleForCells: actions.setDefaultStyleForCells,
};

class Battlefield extends React.Component {
  handlerDragEnter = (coords) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    // for every cell { id: cellId, options: [['style', new style], ['value', new value]] }
    const data = [{ coords, options: [['style', 'ship']] }];
    const { dispatch, changeCells } = this.props;
    // console.log(JSON.stringify(data));
    dispatch(changeCells(data));
  }

  handlerDrop = (coords) => (e) => {
    // e.preventDefault();
    // e.stopPropagation();
    // for every cell { id: cellId, options: [['style', new style], ['value', new value]] }
    const data = [{ coords, options: [['style', 'ship']] }];
    const { dispatch, changeCells } = this.props;
    dispatch(changeCells(data));
  }

  handlerDragOver = () => (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  handlerDragLeave = (coords) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const data = [{ coords }]; // [ ...ids of cells]
    const { dispatch, setDefaultStyleForCells } = this.props;
    dispatch(setDefaultStyleForCells(data));
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
                    onDragOver={this.handlerDragOver(coords)}
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