import React from 'react';
import Battlefield from './Battlefield.jsx';
import Auxiliaryfield from './Auxiliaryfield.jsx';

const Fields = () => {
  return(
    <div className="container mt-5">
      <div className="d-flex flex-column flex-md-row text-center align-items-center align-items-sm-end">
        <Battlefield owner="enemy" />
        <Auxiliaryfield />
        <Battlefield owner="user" />
      </div>
    </div>
  );
};

export default Fields;
