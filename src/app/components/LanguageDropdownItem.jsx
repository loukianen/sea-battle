import React from 'react';
import i18next from 'i18next';

const getLanguage = (lang) => {
  const mapping = {
    en: 'english',
    ru: 'russian',
  };
  return mapping[lang] ? mapping[lang] : null;
};

const LanguageDropdownItem = (props) => {
  const { langId, onClickFunc } = props;
  const language = getLanguage(langId);
  return (
    <div className="dropdown-item d-flex flex-row ">
      <img className="flag border border-info rounded" src={`img/${language}_fl.png`} alt={`${language} flag`} />
      <a className="dropdown-item" href="#" id={`${language}Language`} lang={langId} onClick={onClickFunc}>{i18next.t(`ui.${language}Language`)}</a>
    </div>
  );
};

export default LanguageDropdownItem;
