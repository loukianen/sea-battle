import React from 'react';
import Info from './Info.jsx';
import Flot from './Flot.jsx';

export default class Auxiliaryfield extends React.Component {
  render() {
    return(
      <div id="centerField" className="col d-flex flex-column mb-3">
        <Info />
        <Flot />
      </div>
    );
  }
}