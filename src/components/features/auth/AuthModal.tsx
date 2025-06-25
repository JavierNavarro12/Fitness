import React from 'react';
import ReactDOM from 'react-dom';
import Auth from './Auth';

const AuthModal = (props: React.ComponentProps<typeof Auth>) => {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;
  return ReactDOM.createPortal(
    <Auth {...props} />, 
    modalRoot
  );
};

export default AuthModal; 