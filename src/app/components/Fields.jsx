import React from 'react';
import Battlefield from './Battlefield.jsx';
import Auxiliaryfield from './Auxiliaryfield.jsx';

export default class Fields extends React.Component {
  render() {
    return(
      <div className="container justify-content-around mt-5">
        <div className="row d-flex text-center">
          <Battlefield owner="enemy" />
          <Auxiliaryfield />
          <Battlefield owner="user" />
        </div>
      </div>
    );
  }
}