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

export const isNumeric = (value: any) => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

export const twoDecimalValidation = (value: any) => {
  if (!value) return true;
  return /^\d+(\.\d{1,2})?$/.test(value);
}