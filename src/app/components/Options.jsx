import _ from 'lodash';
import React from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import * as actions from '../actions/index';

const mapStateToProps = (state) => {
  const { gameOptions, gameState, language } = state;
  const props = { gameOptions, gameState, language };
  return props;
};

const actionCreators = {
  setOptions: actions.setOptions,
};

const inputData = [
  {
    blockId: 'block1',
    type: 'item',
    header: 'fieldSize',
    values: ['ten', 'seven', 'five', 'three']
  },
  { blockId: 'block2', type: 'divider' },
  {
    blockId: 'block3',
    type: 'item',
    header: 'enemy',
    values: ['jackSparrow', 'ushakov', 'nahimov'],
  },
  { blockId: 'block4', type: 'divider' },
  { blockId: 'block5', type: 'item', header: 'shipType', values: ['line'] },
];

class Options extends React.Component {
  constructor(props) {
    super(props);
    this.fieldSize = props.gameOptions.fieldSize;
    this.enemy = props.gameOptions.enemy;
    this.shipType = props.gameOptions.shipType;
  }

  changeGameOptions = (e) => {
    e.preventDefault();
    const gameOptions = { fieldSize: this.fieldSize, enemy: this.enemy, shipType: this.shipType };
    const { gameOptions: oldGameOptions, dispatch, setOptions } = this.props;
    if (!_.isEqual(gameOptions, oldGameOptions)) {
      dispatch(setOptions({ gameOptions }));
    }
  }

  handleClick = (header, value) => () => {
    this[header] = value;
  }

  renderOption(value, header) {
    if (header !== 'shipType') {
      return this[header] === value
        ? <input className="form-check-input" type="radio" name={header} id={value} value={value} onClick={this.handleClick(header, value)} defaultChecked></input>
        : <input className="form-check-input" type="radio" name={header} id={value} value={value} onClick={this.handleClick(header, value)}></input>
    }
    return <input className="form-check-input" type="radio" name={header} id={value} value={value} checked disabled></input>
  }

  renderOptions() {
    return <form className="d-flex flex-column justify-content-end" onSubmit={this.changeGameOptions}>
      {inputData.map((item) => {
        if (item.type === 'divider') {
          return <div key={item.blockId} className="dropdown-divider"></div>;
        }
        return (
          <div key={item.blockId} className="dropdown-item d-flex flex-column">
            <h6 className="color-ship-border">{i18next.t(`optionsMenu.${item.header}`)}</h6>
            {item.values.map((value) => (
              <div key={_.uniqueId('param')} className="form-check">
                {this.renderOption(value, item.header)}
                <label className="form-check-label color-ship-border" htmlFor={value}>{i18next.t(`optionsMenu.${value}`)}</label>
              </div>
            ))}
          </div>
        );
      })}
      <button type="submit" className="btn btn-outline-info flex-grow-0 m-2">{i18next.t(`optionsMenu.save`)}</button>
    </form>;
  }

  render() {
    return(
      <li className="nav-item shadow-sm p-3 mb-3 bg-white rounded color-ship-border">
        <a className="btn p-o" type="button" id="navOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{i18next.t('ui.navOptions')}</a>
        <div className="dropdown-menu" aria-labelledby="OptionsMenuButton">
          {this.renderOptions()}
        </div>
      </li>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(Options);
