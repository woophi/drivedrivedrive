import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider as Redux } from 'react-redux';
import { Provider as Fela, ThemeProvider } from 'react-fela';
import { IRenderer as FelaRenderer } from 'fela';
// import { configureFela } from './fela';
// import { mluviiTheme } from 'ui/shared/mluviiUI';
import { ConnectedRouter } from 'react-router-redux';
// import store from 'core/shared/store';
// import { history } from 'ui/application/history';
// import init from 'core/application/init';
// import ApplicationRoot from './components/ApplicationRoot';
// import { AppEntrySettings } from 'core/models/application';

function renderApp(/*fela: { renderer: FelaRenderer, mountNode: HTMLElement }*/) {
  ReactDOM.render(
    // <Redux store={store}>
    //   <Fela renderer={fela.renderer} mountNode={fela.mountNode}>
    //     <ThemeProvider theme={mluviiTheme}>
    //       <ConnectedRouter history={history}>
    //         <CurrentLocaleIntlProvider>
    //           <I18nextProvider i18n={i18n}>
                <div>Hello World</div>,
    //           </I18nextProvider>
    //         </CurrentLocaleIntlProvider>
    //       </ConnectedRouter>
    //     </ThemeProvider>
    //   </Fela>
    // </Redux>,
    document.getElementById('app')
  );
}

export async function entryOperatorDesktop(args: any) {
  console.debug('AppEntry args:', args);

  // store.dispatch({ type: 'appInit', isMobile: args.isMobile, tabId: args.tabId, serverUrl: '', isWindow: true, avSupport: null });
  // store.dispatch({ type: 'setAppSettings', payload: args.appSettings });

  // const fela = configureFela('stylesheet');
  // renderApp(fela);

  // setLocale('operator', args.defaultLanguage);

  // init();

  // /* React HMR */
  // if (module && module.hot) {
  //   module.hot.accept('./components/ApplicationRoot', () => {
  //     renderApp(fela);
  //   });
  // }

  renderApp()
}
