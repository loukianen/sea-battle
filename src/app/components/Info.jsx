import React from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';

const getMessage = (gameState) => {
  switch (gameState) {
    case 'choosingSettings':
      return i18next.t('info.makeSetting');
    case 'settingFlot':
      return i18next.t('info.setFlot');
    default:
      return i18next.t('info.killEnemy');
  }
};

const mapStateToProps = (state) => {
  const { language, gameState } = state;
  const props = { language, gameState };
  return props;
};

class Info extends React.Component {
  render() {
    const { gameState } = this.props;
    const message = getMessage(gameState);
    return (
      <div className="messagefield rounded color-ship-border d-flex align-items-center justify-content-center">
        <div className="text-center p-1"><b>{message}</b></div>
      </div>);
  }
}

export default connect(mapStateToProps)(Info);