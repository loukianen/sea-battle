import React from 'react';
import Start from './Start.jsx';
import Options from './Options.jsx';
import Language from './Language.jsx';

const Nav = () => (
  <ul className="nav flex-column-reverse flex-md-row justify-content-end">
    <Start />
    <Options />
    <Language />
  </ul>
);

export default Nav;
