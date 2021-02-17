import React from 'react';
import { connect } from 'react-redux';
import Info from './Info.jsx';
import Flot from './Flot.jsx';
import Log from './Log.jsx';

const mapStateToProps = (state) => {
  const { gameState } = state;
  const props = { gameState };
  return props;
};

const Auxiliaryfield = (props) => {
  const { gameState } = props;
  return(
    <div id="centerField" className="col d-flex flex-column mb-3">
      <Info />
      {gameState === 'battleIsOn' || gameState === 'finished' ? <Log /> : <Flot />}
    </div>
  );
};

export default connect(mapStateToProps)(Auxiliaryfield);
