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
  { blockId: 'block1', type: 'item', header: 'fieldSize', values: ['ten'] },
  { blockId: 'block2', type: 'divider' },
  { blockId: 'block3', type: 'item', header: 'enemy', values: ['ushakov'] },
  { blockId: 'block4', type: 'divider' },
  { blockId: 'block5', type: 'item', header: 'shipType', values: ['line'] },
];

class Options extends React.Component {
  renderOptions() {
    return inputData.map((item) => {
      if (item.type === 'divider') {
        return <div key={item.blockId} className="dropdown-item d-flex flex-row"></div>;
      }
      return (
        <div key={item.blockId} className="dropdown-item d-flex flex-row">
          <form>
            <h6>{i18next.t(`optionsMenu.${item.header}`)}</h6>
            {item.values.map((value) => (
              <div key={_.uniqueId('param')} className="form-check">
                <input className="form-check-input" type="radio" name={value} id={value} value={value} checked disabled></input>
                <label className="form-check-label" htmlFor={value}>{i18next.t(`optionsMenu.${value}`)}</label>
              </div>
            ))}
          </form>
        </div>
      );
    });
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