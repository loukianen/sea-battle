import React from 'react';
import i18next from 'i18next';

export default class Auxiliaryfield extends React.Component {
  render() {
    return(
      <div id="centerField" className="col d-flex flex-column mb-3">
        <div className="messagefield text-center rounded"></div>
        <div className="d-flex flex-column shipsfield text-center rounded">
          <h5 className="mt-2 color-ship-border">{i18next.t('shipsTable.header')}</h5>
          <table className="table table-borderless color-ship-border">
            <tbody>
              <tr>
                <td className="d-flex flex-row">
                  <div className="ship cell30x30 rounded"></div>
                  <div className="ship cell30x30 rounded"></div>
                  <div className="ship cell30x30 rounded"></div>
                  <div className="ship cell30x30 rounded"></div>
                </td>
                <td>1</td>
                <td>{i18next.t('shipsTable.unit')}</td>
              </tr>
              <tr>
                <td className="d-flex flex-row">
                  <div className="ship cell30x30 rounded"></div>
                  <div className="ship cell30x30 rounded"></div>
                  <div className="ship cell30x30 rounded"></div>
                </td>
                <td>2</td>
                <td>{i18next.t('shipsTable.unit')}</td>
              </tr>
              <tr>
                <td className="d-flex flex-row">
                  <div className="ship cell30x30 rounded"></div>
                  <div className="ship cell30x30 rounded"></div>
                </td>
                <td>3</td>
                <td>{i18next.t('shipsTable.unit')}</td>
              </tr>
              <tr>
                <td className="d-flex flex-row">
                  <div className="ship cell30x30 rounded"></div>
                </td>
                <td>4</td>
                <td>{i18next.t('shipsTable.unit')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}