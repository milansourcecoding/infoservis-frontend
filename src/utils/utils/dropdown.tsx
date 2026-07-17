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
import { City }  from 'country-state-city';
import { RoleType, UnitType, ManagerType } from '../enums.tsx';

// ----------------------------------------------------------------------

export const getRoles = () => {
    return Object.entries(RoleType).map(([key, value], index) => ({
        id: value,
        value: key,
    }));
}

export const getUnitTypes = () =>
  Object.entries(UnitType).map(([key, value]) => ({
    id: value,
    value: key,
  }));

  export const getManagerTypes = () =>
  Object.entries(ManagerType).map(([key, value]) => ({
    id: value,
    value: key,
  }));

export const getCities = (isoCode = 'RS') => {
    let arr = City.getCitiesOfCountry(isoCode)
    if(arr && arr.length > 0){
        arr = arr.map((x: any) => {
            let newName = x?.name;

            if(x?.name == 'Belgrade'){
                newName = 'Beograd';
            }

            return {
                ...x,
                name: newName
            }
        });
    }
    return arr;
}
