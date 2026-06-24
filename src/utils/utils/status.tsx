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
import { t } from 'i18next';
import TimelineDot from '@mui/lab/TimelineDot';
import { StatusDokumenta } from '../enums.tsx';

// ----------------------------------------------------------------------

export const getStatusDokumenta = (statusDokumenta = StatusDokumenta.None) => {
  if(statusDokumenta == StatusDokumenta.Processing){
    return t('enums.statusDokumenta.processing');
  } if(statusDokumenta == StatusDokumenta.Zavrsen){
    return t('enums.statusDokumenta.zavrsen');
  } if(statusDokumenta == StatusDokumenta.Storniran){
    return t('enums.statusDokumenta.storniran');
  } else {
    return '-';
  }
}
export const getTabColorStatusDokumenta = (statusDokumenta = 'all') => {
  if(statusDokumenta === 'active'){
    return 'info';
  } if(statusDokumenta === 'processing'){
    return 'warning';
  } if(statusDokumenta === 'finished'){
    return 'success';
  } if(statusDokumenta === 'cancelled'){
    return 'error';
  } else {
    return 'default';
  }
}
export const getColorStatusDokumenta = (statusDokumenta = StatusDokumenta.None) => {
    if(statusDokumenta == StatusDokumenta.Processing){
      return 'warning';
    } if(statusDokumenta == StatusDokumenta.Zavrsen){
      return 'success';
    } if(statusDokumenta == StatusDokumenta.Storniran){
      return 'error';
    } else {
      return 'default';
    }
}
export const getTimelineColorStatusDokumenta = (statusDokumenta = StatusDokumenta.None) => {
    if(statusDokumenta == StatusDokumenta.Processing){
      return <TimelineDot color={'warning'} />
    } if(statusDokumenta == StatusDokumenta.Zavrsen){
      return <TimelineDot color={'success'} />
    } if(statusDokumenta == StatusDokumenta.Storniran){
      return <TimelineDot color={'error'} />
    } else {
      return <TimelineDot color={'grey'} />
    }
}
