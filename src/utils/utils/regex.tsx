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
// import {  } from '../enums.tsx';

// ----------------------------------------------------------------------

export const timeRegex = () => {
  return "^(00:|0[0-9]:|1[0-2]:|[1-9]:)([0-5][0-9]) ([a][m]|[A][M]|[p][m]|[P][M])$";
}

export const time24Regex = () => {
  return "^(?:[01]?[0-9]|2[0-3]):[0-5][0-9]$";
}