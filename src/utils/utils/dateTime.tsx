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
import moment from 'moment';
// import {  } from '../enums.tsx';
import { apiDateFormat } from '../utils.tsx';

// ----------------------------------------------------------------------

export const createDateAsUTC = (date: any) => {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}
export const saveDate = (date: any) => {
  try {
    let value = (date && date !== '') ? date : '';
    // let dateValue = createDateAsUTC(moment(value).toDate());
    return (value !== '') ? moment(value).format(apiDateFormat()) : null;
  }catch(e){
    return null;
  }
}
export const prepareDate = (date: any) => {
  try {
    let value = (date && date !== '') ? date : '';
    let dateValue = moment(date, apiDateFormat()).toDate();
    return (value !== '') ? dateValue : '';
  }catch(e){
    return '';
  }
}

export const getDateRanges = (exclude: any = ['Yesterday', 'Last 6 Months', 'This Year', 'Last Year']) => {
  let arr = [
    {
      label: 'Today',
      hasCustomRendering: true,
      isSelected() {
        return false;
      },
      range: () => {
        return {
          startDate: moment().toDate(),
          endDate: moment().toDate(),
        }
      },
    },
    {
      label: 'Tomorrow',
      hasCustomRendering: true,
      isSelected() {
        return false;
      },
      range: () => {
        return {
          startDate: moment().add(1, 'days').toDate(),
          endDate: moment().add(1, 'days').toDate(),
        }
      },
    },
    {
      label: 'Yesterday',
      hasCustomRendering: true,
      isSelected() {
        return false;
      },
      range: () => {
        return {
          startDate: moment().subtract(1, 'days').toDate(),
          endDate: moment().subtract(1, 'days').toDate(),
        }
      },
    },
    {
      label: 'This Week',
      hasCustomRendering: true,
      isSelected() {
        return false;
      },
      range: () => {
        return {
          startDate: moment().startOf('isoWeek').toDate(),
          endDate: moment().endOf('isoWeek').toDate(),
        }
      },
    },
    {
      label: 'Last Week',
      hasCustomRendering: true,
      isSelected() {
        return false;
      },
      range: () => {
        return {
          startDate: moment().subtract(1, 'week').startOf('isoWeek').toDate(),
          endDate: moment().subtract(1, 'week').endOf('isoWeek').toDate(),
        }
      },
    },
    {
      label: 'This Month',
      hasCustomRendering: true,
      isSelected() {
        return false;
      },
      range: () => {
        return {
          startDate: moment().startOf('month').toDate(),
          endDate: moment().endOf('month').toDate(),
        }
      },
    },
    {
      label: 'Last Month',
      hasCustomRendering: true,
      isSelected() {
        return false;
      },
      range: () => {
        return {
          startDate: moment().subtract(1, 'month').startOf('month').toDate(),
          endDate: moment().subtract(1, 'month').endOf('month').toDate(),
        }
      },
    },
    {
      label: 'Last 6 Months',
      hasCustomRendering: true,
      isSelected() {
        return false;
      },
      range: () => {
        return {
          startDate: moment().subtract(5, 'month').startOf('month').toDate(),
          endDate: moment().endOf('month').toDate(),
        }
      },
    },
    {
      label: 'This Year',
      hasCustomRendering: true,
      isSelected() {
        return false;
      },
      range: () => {
        return {
          startDate: moment().startOf('year').toDate(),
          endDate: moment().endOf('year').toDate(),
        }
      },
    },
    {
      label: 'Last Year',
      hasCustomRendering: true,
      isSelected() {
        return false;
      },
      range: () => {
        return {
          startDate: moment().subtract(1, 'year').startOf('year').toDate(),
          endDate: moment().subtract(1, 'year').endOf('year').toDate(),
        }
      },
    },
  ]

  if (exclude && exclude.length > 0) {
    arr = arr.filter(x => !exclude.includes(x.label))
  }

  return arr;
}
export const getSelectedRangeDate = (selected: any) => {
  if(selected && selected.length > 0){
    let selectedRange = selected[0];

    return { 
      from: (selectedRange && selectedRange.startDate) ? moment(selectedRange.startDate).format(apiDateFormat()) : null,
      to: (selectedRange && selectedRange.endDate) ? moment(selectedRange.endDate).format(apiDateFormat()) : null,
    }
  }

  return null;
}