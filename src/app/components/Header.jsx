import React from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';
import cn from 'classnames';
import Nav from './Nav.jsx';

const mapStateToProps = (state) => state.language;

const Header = () => {
  const screenWidgh = window.innerWidth;
  const isScreenNarrow = screenWidgh < 800;
  const mainHeaderClass = cn('text-info', 'text-center', 'w-100', {
    'display-2': !isScreenNarrow,
    'display-4': isScreenNarrow,
  });
  return (
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

export default connect(mapStateToProps)(Header);
