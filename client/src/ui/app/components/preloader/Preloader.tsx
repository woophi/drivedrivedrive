import * as React from 'react';
import Animation from './Animation';

export default ({ isShow }: {isShow: boolean}) => {
  return isShow && (
    <div style={container}>
      <Animation />
    </div>
  );
};

const container: React.CSSProperties = {
  zIndex: 2,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, .5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};


