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

import '../../assets/css/styles.css';

// ----------------------------------------------------------------------

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