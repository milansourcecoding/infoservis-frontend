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

export const getUint8Array = (base64: any) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Uint8Array(byteNumbers);
}
export const downloadPDF = (name: string, byte: any, type = "application/pdf") => {
  let byteArray = getUint8Array(byte);
  let blob = new Blob([byteArray], { type });
  let url = window.URL.createObjectURL(blob);
  let link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
export const viewPDF = (byte: any) => {
  let byteArray = getUint8Array(byte);
  const blob = new Blob([byteArray], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
export const downloadCSV = (name: string, byte: any, type = "text/csv") => {
  let blob = new Blob([byte], { type });
  let url = window.URL.createObjectURL(blob);
  let link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
