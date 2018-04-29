import * as React from 'react';
import * as ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
// import UserConfirmationModal from 'ui/application/components/UserConfirmationModal';

export const history = createHistory({
  basename: '/',
  getUserConfirmation(message, callback) {
    ReactDOM.render(
      // <UserConfirmationModal message={message} callback={callback} />,
      <div>po sjebam?</div>,
      document.getElementById('user_confirmation_modal_container')
    );
  }
});
