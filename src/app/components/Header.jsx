import React from 'react';
import Nav from './Nav.jsx';
import i18next from 'i18next';

const Header = () => {
  return(
    <div className="d-inline-flex align-content-center w-100">
      <div className="d-flex img-box">
        <img className="rounded" id="logo" src="img/logo_356_x_200.jpg" alt="ship" />
      </div>
      <div className="flex-column align-content-end w-100">
        <div className="display-1 text-info text-center w-100" id="mainHeader">{i18next.t('ui.mainHeader')}</div>
        <Nav />
      </div>
    </div>
  );
};

export default Header;
