import React from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { letters } from '../bin/utils';

const mapStateToProps = (state) => {
  const { language, log, score } = state;
  const props = { language, log, score };
  return props;
};

class Log extends React.Component {
  render() {
    const { log, score } = this.props;
    return (
      <div className="d-flex flex-column shipsfield text-center rounded">
        <div className="d-flex flex-row justify-content-around">
          <h5 className="mt-2 color-ship-border">{i18next.t('ui.score')}</h5>
          <h5 className="mt-2 color-ship-border">{score}</h5>
        </div>
        <table className="table-sm table-borderless color-ship-border border-top border-info">
          <tbody>
            <tr>
              <th className="color-ship-border">{i18next.t('log.n')}</th>
              <th className="color-ship-border">{i18next.t('log.player')}</th>
              <th className="color-ship-border">{i18next.t('log.shoot')}</th>
              <th className="color-ship-border">{i18next.t('log.result')}</th>
            </tr>
            {log.map(([id, player, coords, result]) => {
              const playerName = i18next.t(`log.${player}`);
              let coordsValue = null;
              if (coords !== null) {
                const { x, y } = coords;
                const letterFromX = i18next.t(`field.${letters[x]}`);
                coordsValue = `${letterFromX}${y}`;
              }
              const resultValue = i18next.t(`log.${result}`);
              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{playerName}</td>
                  <td>{coordsValue}</td>
                  <td>{resultValue}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Log);