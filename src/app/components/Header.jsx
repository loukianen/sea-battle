import React from 'react';
import Nav from './Nav.jsx';
import i18next from 'i18next';
import cn from 'classnames';

const Header = () => {
  // const viewportWidgh = window.visualViewport.width;
  const mainHeaderClass = cn('text-info', 'text-center', 'w-100', {
    'display-2': true, // viewportWidgh >= 768,
    // 'display-3': viewportWidgh < 768,
  });
  return(
    <div className="d-flex flex-column flex-md-row justify-content-center w-100">
      <div className="d-flex justify-content-center img-box">
        <img className="rounded" id="logo" src="img/logo_356_x_200.jpg" alt="ship" />
      </div>
      <div className="flex-column align-content-end w-100">
        <div className={mainHeaderClass} id="mainHeader">{i18next.t('ui.mainHeader')}</div>
        <Nav />
      </div>
    </div>
  );
};

export default Header;
