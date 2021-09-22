import React from 'react';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Header from './Header.jsx';
import Fields from './Fields.jsx';
import en from '../locale/en';
import ru from '../locale/ru';

const initInternationalization = () => {
  const resources = { en, ru };
  i18next
    .use(LanguageDetector)
    .init({
      fallbackLng: 'en',
      debug: true,
      resources,
    });
};

const App = () => {
  initInternationalization();
  return (
    <div className="container justify-content-center">
      <Header />
      <Fields />
    </div>
  );
};

export default App;
