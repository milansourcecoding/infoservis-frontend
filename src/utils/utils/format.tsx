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
import numeral from 'numeral';
// import { t } from 'i18next';
// import moment from 'moment';
// import {  } from '../enums.tsx';
import { convertMinToHours } from './convert.tsx';

// ----------------------------------------------------------------------

export const dateTimeFormat = () => {
  return 'dd MMM yyyy HH:mm';
}
export const dateFormat = () => {
  return 'dd MMM yyyy';
}
export const timeFormat = () => {
  return 'HH:mm';
}
export const apiDateFormat = () => {
  return 'YYYY-MM-DD';
}
export const dateViewFormat = () => {
  return 'MMM DD, yyyy';
}


export const formatNumber = (numb = 0, format = '0,0.00', postfix = '') => {
  try {
    return numeral(numb).format(format) + postfix;
  } catch (e) {
    return numb;
  }
}
export const formatCurrency = (numb = 0, format = '0,0.00', currency = ' RSD') => {
  try {
    return numeral(numb).format(format) + currency;
  } catch (e) {
    return numb;
  }
}
export const formatArea = (numb = 0, format = '0,0.00', unit = ' m²') => {
  try {
    return numeral(numb).format(format) + unit;
  } catch (e) {
    return numb;
  }
}
export const formatNosivost = (numb = 0, jm = 'Kg') => {
  return numb + ' ' + jm;
}
export const formatPhoneNumnber = () => {
  return "069/99-99-999";
}
export const formatMinToHours = (min = null) => {
  let numb = convertMinToHours(min);
  return formatNumber(numb, '0.[00]', ' h');
}
export const formatBytes = (numb: number|null = 0, format = '0.0 b') => {
  try {
    return numeral(numb).format(format);
  } catch (e) {
    return numb;
  }
}