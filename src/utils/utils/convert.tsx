/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-unresolved */
/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-empty */
/* eslint-disable no-else-return */
/* eslint-disable prefer-const */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-template */
/* eslint-disable no-bitwise */
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line no-bitwise
import _ from 'lodash';
// import { t } from 'i18next';
// import moment from 'moment';
// import {  } from '../enums.tsx';

// ----------------------------------------------------------------------

export const convertMinToHours = (min: any = null) => {
  let numb = 0;

  if(min){
    try {
      numb = (parseInt(min, 10) / 60);
    } catch (e) {
      numb = 0;
    }
  } else {
    numb = 0;
  }

  return numb;
}
export const convertHoursToMin = (h: any = null) => {
  let numb = 0;

  if(h){
    try {
      numb = (parseFloat(h) * 60);
    } catch (e) {
      numb = 0;
    }
  } else {
    numb = 0;
  }

  return numb;
}

export const lightenHexColor = (hex: string, amount: number = 0.9) => {
  hex = hex.replace('#', '');

  const num = parseInt(hex, 16);

  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;

  r = Math.round(r + (255 - r) * amount);
  g = Math.round(g + (255 - g) * amount);
  b = Math.round(b + (255 - b) * amount);

  return (
    '#' +
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0')
  );
}