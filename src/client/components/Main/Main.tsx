import clsx from 'clsx';
import Teleinfo from '../Teleinfo';
import '../../styles/module.scss';
import '../../styles/reset.scss';
import './Main.scss';

/**
 * MagicMirror
 * Main REACT component
 */
const Main = () => {
  return (
    <div className={clsx('main', 'dimmed', 'light', 'small')}>
      <Teleinfo />
    </div>
  );
};

export default Main;
