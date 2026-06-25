/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-unresolved */
/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-empty */
/* eslint-disable no-else-return */
/* eslint-disable prefer-const */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-template */
// eslint-disable-next-line import/no-extraneous-dependencies
import _ from 'lodash';
// import { t } from 'i18next';
// import moment from 'moment';
// import {  } from '../enums.tsx';
// import {  } from '../utils.tsx';

import { STORAGE_USER } from './auth';

// ----------------------------------------------------------------------

export const getUser = () => {
  try {
    const savedUser = localStorage.getItem(STORAGE_USER);
    let user = JSON.parse(savedUser);
    return user;
  } catch(e){
    return null;
  }
}