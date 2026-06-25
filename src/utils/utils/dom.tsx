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

const CHARACTERS = ['\\', ':', ';', '*', '?', '"', '<', '>', '|',];

// ----------------------------------------------------------------------

export const scrollTo = (selector: string = '', time: number = 100) => {
  setTimeout(() => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, time);
}
export const jumpTo = (selector: string = '', time: number = 100) => {
  setTimeout(() => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'instant' });
    }
  }, time);
}
export const scrollToTop = (selector: string = '', time: number = 100) => {
  setTimeout(() => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollTop = 0;
    }
  }, time);
}

export const autoFocus = (selector: string = '', time: number = 100) => {
  setTimeout(() => {
    const element = document.querySelector(selector) as HTMLInputElement;
    if (element) {
      element.focus();
    }
  }, time);
}

export const escapeChar = (e: any = null, char: any = null) => {
  if (e && char) {
      if (char === e.key) {
          e.preventDefault();
          e.stopPropagation();
          return true;
      }
  }

  return false;
}
export const escapeChars = (e: any = null) => {
  if (e) {
      if (CHARACTERS.includes(e.key)) {
          return escapeChar(e, e.key);
      }
  }

  return false;
}
export const escapeCharsInStringOnPaste = (str: any = '') => {
  let cleanedText = str;
  CHARACTERS.forEach((character) => {
      cleanedText = cleanedText.split(character).join('');
  });
  return cleanedText;
}
