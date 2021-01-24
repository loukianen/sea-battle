import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en';
import ru from './ru';

/* const setLanguage = (language = window.navigator.language) => {
  switch (language) {
    case 'ru':
      return 'ru';
    default:
      return 'en';
  }
}; */

const changeLanguage = (event) => {
  event.preventDefault();
  const language = event.target.getAttribute('lang');
  i18next.changeLanguage(language, () => null);
};

const applyUi = () => {
  const headElement = document.querySelector('head');
  const titleElement = headElement.querySelector('title');
  titleElement.textContent = i18next.t('ui.mainHeader');
  const placesForFilling = ['mainHeader', 'enemyFlot', 'userFlot', 'navStart', 'navOptions', 'navLanguage'];
  placesForFilling.forEach((el) => {
    const element = document.getElementById(el);
    element.textContent = i18next.t(`ui.${el}`);
  });

  const russian = document.getElementById('russianLanguage');
  const english = document.getElementById('englishLanguage');
  russian.textContent = i18next.t('ui.russianLanguage');
  english.textContent = i18next.t('ui.englishLanguage');
  russian.addEventListener('click', changeLanguage);
  english.addEventListener('click', changeLanguage);

  const shipsTableElement = document.querySelector('h5');
  shipsTableElement.textContent = i18next.t('shipsTable.header');
  const shipTableRows = document.querySelectorAll('tr');
  shipTableRows.forEach((el) => {
    const unit = el.lastElementChild;
    unit.textContent = i18next.t('shipsTable.unit');
  });
};

const makeFirstRow = () => {
  const letters = [null, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', null];
  return letters.map((letter) => {
    const node = document.createElement('div');
    node.classList.add('cell');
    if (letter !== null) {
      node.textContent = i18next.t(`field.${letter}`);
    }
    return node;
  });
};

const makeRow = (styles, number) => {
  const nodes = styles.map((letter) => {
    const node = document.createElement('div');
    if (letter !== null) {
      node.classList.add(letter);
    }
    return node;
  });
  if (number) {
    nodes[0].textContent = number;
  }
  return nodes;
};

const makeMiddleRows = () => {
  const fieldSide = 10;
  let rowCount = 2;
  let middleRows = [];
  while (rowCount < fieldSide) {
    const curRow = makeRow(['cell', 'cell-left', ...Array(8).fill('cell-inside'), 'cell-right', null], rowCount);
    middleRows = [...middleRows, ...curRow];
    rowCount += 1;
  }
  return middleRows;
};

const renderBattleField = (node) => {
  const fieldSide = 10;
  const firstRow = makeFirstRow();
  const secondRow = makeRow(['cell', 'cell-top-left', ...Array(8).fill('cell-top'), 'cell-top-right', null], 1);
  const middleRows = makeMiddleRows();
  const eleventhRow = makeRow(['cell', 'cell-bottom-left', ...Array(fieldSide - 2).fill('cell-bottom'), 'cell-bottom-right', null], fieldSide);
  const twelvthRow = makeRow([...Array(fieldSide + 2).fill(null)]);
  node.append(...firstRow, ...secondRow, ...middleRows, ...eleventhRow, ...twelvthRow);
};

export default () => {
  const resources = { en, ru };

  i18next
    .use(LanguageDetector)
    .init({
      fallbackLng: 'en',
      debug: true,
      resources,
    });

  applyUi();
  const enemyField = document.getElementById('enemyField');
  const userField = document.getElementById('userField');
  renderBattleField(enemyField);
  renderBattleField(userField);
};
