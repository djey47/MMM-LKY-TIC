import classnames from 'classnames';
import { FunctionComponent } from 'react';
import ConfigurationContext from '../../contexts/ConfigurationContext';
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
    <ConfigurationContext.Consumer>
      {(configuration) => (
        <div className={classnames('main', 'dimmed', 'light', 'small')}>
          <Teleinfo currencySymbol={configuration?.currencySymbol || ''} />
        </div>
      )}
    </ConfigurationContext.Consumer>
  );
};

export default Main;
