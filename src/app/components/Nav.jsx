import React from 'react';
import Language from './Language.jsx';
import Options from './Options.jsx';
import i18next from 'i18next';

export default class Nav extends React.Component {
  render() {
    return(
      <ul className="nav flex-row justify-content-end">
        <li className="nav-item shadow-sm p-3 mb-3 bg-white rounded color-ship-border">
          <a className="btn" type="button" id="navStart" aria-haspopup="true" aria-expanded="false">{i18next.t('ui.navStart')}</a>
        </li>
        <Options />
        <Language />
      </ul>
    );
  }
}