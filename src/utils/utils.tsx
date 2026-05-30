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
import { t } from 'i18next';
import moment from 'moment';
import TimelineDot from '@mui/lab/TimelineDot';
import { UpravnikType, RadnikType, StatusDokumenta } from './enums.tsx';

import '../assets/css/styles.css';

const CHARACTERS = ['\\', ':', ';', '*', '?', '"', '<', '>', '|',];

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

export const flash = (item: any, anim = 'flash-update') => {
  return new Promise<void>((resolve) => {
    if(item instanceof Array){
      item.forEach((itm, i) => {
        setTimeout(() => {
          try {
            let el = document.getElementById("row_" + itm.id);
            el?.classList.add(anim);
            setTimeout(() => {
              try {
                el?.classList.remove(anim);
              } catch (err) {}

              resolve();
            }, 1500);
          } catch (err) {}
        }, 500);
      });
    } else {
      setTimeout(() => {
        try {
          let el = document.getElementById("row_" + item.id);
          el?.classList.add(anim);
          setTimeout(() => {
            try {
              el?.classList.remove(anim);
            } catch (err) {}

            resolve();
          }, 1500);
        } catch (err) {}
      }, 500);
    }
  });
};
export const removeRow = async (rows: Array<any>, item: any) => {
  let newRows = _.cloneDeep(rows);

  if(item instanceof Array){
    newRows = newRows.filter((row) => !item.some((x) => x.id === row.id));
  } else {
    newRows = newRows.filter(x => x?.id !== item?.id);
  }

  await flash(item, 'flash-remove');
  return newRows;
}
export const createRow = (rows: Array<any>, item: any) => {
  let newRows = _.cloneDeep(rows);
  newRows.unshift(item);
  flash(item, 'flash-create');
  return newRows;
}
export const updateRow = (rows: Array<any>, item: any) => {
  let newRows = _.cloneDeep(rows);

  if(item instanceof Array){
    item.forEach((itm) => {
      const index = newRows.findIndex((x) => x.id === itm.id);
      if (index !== -1) {
        newRows.splice(index, 1, itm);
      }
    });

  } else {
    const index = newRows.findIndex(x => x.id === item.id);
    if(index !== -1){
      newRows.splice(index, 1, item);
    }
  }

  flash(item, 'flash-update');
  return newRows;
}


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

export const formatNumber = (numb = 0, format = '0,0.00', currency = ' RSD') => {
  try {
    return numeral(numb).format(format) + currency;
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

export const isNumeric = (value: any) => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

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

export const twoDecimalValidation = (value: any) => {
  if (!value) return true;
  return /^\d+(\.\d{1,2})?$/.test(value);
}


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
      fromDate: (selectedRange && selectedRange.startDate) ? moment(selectedRange.startDate).format(apiDateFormat()) : null,
      toDate: (selectedRange && selectedRange.endDate) ? moment(selectedRange.endDate).format(apiDateFormat()) : null,
    }
  }

  return null;
}

export const scrollTo = (selector: string = '', time: number = 100) => {
  setTimeout(() => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, time);
}

export const getUpravnikType = (upravnikType = UpravnikType.None) => {
  if(upravnikType == UpravnikType.DomaceLice){
    return t('enums.upravnikType.domaceLice');
  } else if(upravnikType == UpravnikType.ProfesionalniUpravnik){
    return t('enums.upravnikType.profesionalniUpravnik');
  } else {
    return '-';
  }
}
export const getRadnikType = (radnikType = RadnikType.None) => {
  if(radnikType == RadnikType.Serviser){
    return t('enums.radnikType.serviser');
  } else {
    return '-';
  }
}
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
