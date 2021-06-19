import React from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import LanguageDropdownItem from './LanguageDropdownItem.jsx'

const mapStateToProps = (state) => {
  const { language } = state;
  const props = { language };
  return props;
};
  
const actionCreators = {
  setLanguage: actions.setLanguage,
};

class Language extends React.Component {
  constructor(props) {
    super(props);
    this.title = document.querySelector('title');
  }
  
  changeLanguage = (e) => {
    e.preventDefault();
    const language = e.target.getAttribute('lang');
    i18next.changeLanguage(language);
    const { dispatch, setLanguage } = this.props;
    dispatch(setLanguage(language));
  }

  componentDidMount() {
    this.title.textContent = i18next.t('ui.mainHeader');
  }

  componentDidUpdate() {
    this.title.textContent = i18next.t('ui.mainHeader');
  }

  render() {
    return(
      <li className="nav-item shadow-sm p-3 mb-3 bg-white rounded color-ship-border">
        <a className="btn p-o" type="button" id="navLanguage" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{i18next.t('ui.navLanguage')}</a>
        <div className="dropdown-menu" aria-labelledby="languageMenuButton">
          <LanguageDropdownItem langId="ru" onClickFunc={this.changeLanguage} />
          <LanguageDropdownItem langId="en" onClickFunc={this.changeLanguage} />
        </div>
      </li>
    );
  }
}

/*
<div className="dropdown-item d-flex flex-row">
            <img className="flag border border-info rounded" src="img/russian_fl.png" alt="russian flag" />
            <a className="dropdown-item" href="#" lang="ru" id="russianLanguage" onClick={this.changeLanguage}>{i18next.t('ui.russianLanguage')}</a>
          </div>
          <div className="dropdown-item d-flex flex-row">
            <img className="flag border border-info rounded" src="img/united-kingdom_fl.png" alt="british flag" />
            <a className="dropdown-item" href="#" lang="en" id="englishLanguage" onClick={this.changeLanguage}>{i18next.t('ui.englishLanguage')}</a>
          </div>
          */
export default connect(mapStateToProps, actionCreators)(Language);
