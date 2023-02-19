import classnames from 'classnames';
import { FunctionComponent } from 'react';
import Teleinfo from '../Teleinfo/Teleinfo';

import '../../styles/module.scss';
import '../../styles/reset.scss';
import './Main.scss';

/**
 * MagicMirror
 * Main REACT component
 */
const Main: FunctionComponent = () => {
  return (
    <div className={classnames('main', 'dimmed', 'light', 'small')}>
      <Teleinfo />
    </div>
  );
};

export default Main;
