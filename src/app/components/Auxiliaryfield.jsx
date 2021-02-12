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

class Auxiliaryfield extends React.Component {
  render() {
    const { gameState } = this.props;
    const curComponent = gameState === 'battleIsOn' ? Log : Flot;
    return(
      <div id="centerField" className="col d-flex flex-column mb-3">
        <Info />
        {gameState === 'battleIsOn' ? <Log /> : <Flot />}
      </div>
    );
  }
}

export default connect(mapStateToProps)(Auxiliaryfield);
