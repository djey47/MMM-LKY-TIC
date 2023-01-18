import { FunctionComponent } from 'react';
import classnames from 'classnames';
import Teleinfo from '../Teleinfo/Teleinfo';

import '../../styles/reset.scss';
import '../../styles/module.scss';
import './Main.scss';

interface MainProps {
  config?: ModuleConfiguration;
}

/**
 * MagicMirror
 * Main REACT component
 */
const Main: FunctionComponent<MainProps> = (props: MainProps) => {
  return (
    <div className={classnames('main', 'dimmed', 'light', 'small')}>
      <Teleinfo currencySymbol={props.config?.currencySymbol || ''} />
    </div>
  );
}

export default Main;
