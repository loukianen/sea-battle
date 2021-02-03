import React from 'react';
import Start from './Start.jsx';
import Options from './Options.jsx';
import Language from './Language.jsx';

export default class Nav extends React.Component {
  render() {
    return(
      <ul className="nav flex-row justify-content-end">
        <Start />
        <Options />
        <Language />
      </ul>
    );
  }
}