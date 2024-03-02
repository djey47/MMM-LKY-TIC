import React from 'react';
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

// global mocks

// font-awesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: (props: FontAwesomeIconProps) => <div>FontAwesomeIcon component {JSON.stringify(props)}</div>,
}));
jest.mock('@fortawesome/free-regular-svg-icons', () => ({
  faCircleQuestion: 'faCircleQuestion',
}));
jest.mock('@fortawesome/free-solid-svg-icons', () => ({
  faBoltLightning: 'faBoltLightning',
  faLeaf: 'faLeaf',
  faPlugCircleBolt: 'faPlugCircleBolt',
  faPlugCircleExclamation: 'faPlugCircleExclamation',
}));
