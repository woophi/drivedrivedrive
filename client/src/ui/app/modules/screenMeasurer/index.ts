import { injectReducer } from 'core/shared/store';
import ScreenMeasurer from './components';

import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';

injectReducer('screen', reducer);

export { actions, selectors };
export default ScreenMeasurer;
