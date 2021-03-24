import _ from 'lodash';
import React from 'react';
import $ from 'jquery';
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
    this.options = {
      fieldSize: null,
      enemy: null,
     shipType: null,
    };
  }

  changeGameOptions = (e) => {
    e.preventDefault();
    const form = document.getElementById('optionsFopm');
    this.options.fieldSize = form.elements.fieldSize.value;
    this.options.enemy = form.elements.enemy.value;
    this.options.shipType = form.elements.shipType.value;
    const gameOptions = { ...this.options };
    const { gameOptions: oldGameOptions, gameState, dispatch, setOptions } = this.props;
    if (!_.isEqual(gameOptions, oldGameOptions)) {
      if (gameState === 'settingFlot' || gameState === 'battleIsOn') {
        $('#warningChangeOptionsModal').modal('show');
      } else {
        dispatch(setOptions({ gameOptions }));
      }
    }
  }

  cancelChangeOptions = () => {
    $('#warningChangeOptionsModal').modal('hide');
    this.forceUpdate();
  }

  startChangeOptions = () => {
    const { dispatch, setOptions } = this.props;
    const gameOptions = { ...this.options };
    $('#warningChangeOptionsModal').modal('hide');
    dispatch(setOptions({ gameOptions }));
  }

  renderOption(value, header) {
    const { gameOptions } = this.props;
    if (header !== 'shipType') {
      return gameOptions[header] === value
        ? <input className="form-check-input" type="radio" name={header} id={value} value={value} defaultChecked></input>
        : <input className="form-check-input" type="radio" name={header} id={value} value={value}></input>
    }
    return <input className="form-check-input" type="radio" name={header} id={value} value={value} checked disabled></input>
  }

  renderOptions() {
    return <form id="optionsFopm" method="post" className="d-flex flex-column justify-content-end" onSubmit={this.changeGameOptions}>
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
      <button type="submit" className="btn btn-outline-info flex-grow-0 m-2">{i18next.t('optionsMenu.save')}</button>
    </form>;
  }

  render() {
    return(
      <div>
        <div className="modal fade" id="warningChangeOptionsModal" tabIndex="-1" aria-labelledby="warningChangeOptionsModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="warningChangeOptionsModalLabel">{i18next.t('alert.warning')}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {i18next.t('alert.areYouSureChangeSetting')}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={this.cancelChangeOptions}>{i18next.t('alert.cancel')}</button>
                <button type="button" className="btn btn-info" onClick={this.startChangeOptions}>{i18next.t('alert.continue')}</button>
              </div>
            </div>
          </div>
        </div>
        <li className="nav-item shadow-sm p-3 mb-3 bg-white rounded color-ship-border">
          <a className="btn p-o" type="button" id="navOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{i18next.t('ui.navOptions')}</a>
          <div className="dropdown-menu" aria-labelledby="OptionsMenuButton">
            {this.renderOptions()}
          </div>
        </li>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(Options);
