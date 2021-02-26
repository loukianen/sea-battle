import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Header from './Header.jsx';
import Fields from './Fields.jsx';
import en from '../locale/en';
import ru from '../locale/ru';

const mapStateToProps = (state) => {
  const { language } = state;
  const props = { language };
  return props;
};

const actionCreators = {
  setLanguage: actions.setLanguage,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.init();
  }

  init() {
    const resources = { en, ru };
    i18next
      .use(LanguageDetector)
      .init({
        fallbackLng: 'en',
        debug: true,
        resources,
      });
  }

  render() {
    return (
      <div className="container justify-content-center">
        <Header />
        <Fields />
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(App);