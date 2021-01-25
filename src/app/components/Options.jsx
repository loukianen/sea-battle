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

const divider = <div className="dropdown-item d-flex flex-row"></div>;

const inputData = [
  { type: 'item', header: 'fieldSize', values: ['ten'] },
  { type: 'divider' },
  { type: 'item', header: 'enemy', values: ['ushakov'] },
  { type: 'divider' },
  { type: 'item', header: 'shipType', values: ['line'] },
];

class Options extends React.Component {
  renderOptions() {
    return inputData.map((item) => {
      if (item.type === 'divider') {
        return divider;
      }
      return (
        <div key={item.header} className="dropdown-item d-flex flex-row">
          <form>
            <h6>{i18next.t(`optionsMenu.${item.header}`)}</h6>
            {item.values.map((value) => (
              <div key={value} className="form-check">
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