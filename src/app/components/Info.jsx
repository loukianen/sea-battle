import React from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';

const mapStateToProps = (state) => {
  const { language, billboard } = state;
  const props = { language, billboard };
  return props;
};
const Info = (props) => {
  const { billboard } = props;
  return (
    <div className="messagefield d-flex align-items-center justify-content-center rounded color-ship-border">
      <div className="p-1"><b>{i18next.t(billboard)}</b></div>
    </div>
  );
};

export default connect(mapStateToProps)(Info);
