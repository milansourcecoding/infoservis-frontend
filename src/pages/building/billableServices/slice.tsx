/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-template */
/* eslint-disable import/extensions */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable arrow-body-style */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-loop-func */
/* eslint-disable eqeqeq */
import React, { createContext, useContext } from 'react';
import { useFormik as useFormikOriginal } from 'formik';
import _ from 'lodash';

import {
  Grid,
  ListItemText,
} from '@mui/material';

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { da } from 'date-fns/locale';
import axios from '../../../utils/axios.jsx';
import Yup from '../../../utils/yup.tsx';
import { isNumeric, getUnitTypes, getBillingTypes, } from '../../../utils/utils.tsx';
import { RoleType, ManagerType, UnitType, BillingType } from '../../../utils/enums.tsx';



export const API = 'billable-service';
export const LANGUAGE = 'billableService';
export const name = LANGUAGE + 'Slice';
export const pageRoles = [RoleType.SuperAdmin, RoleType.OrganizationAdmin, RoleType.Manager, RoleType.Accountant, RoleType.Worker];


export const getFields = (t: any, field: string) => {
  let fields: any = [
    {
      id: 'name',
      name: 'name',
      label: t(LANGUAGE + '.table.name'),
      placeholder: '',
    },
    {
      id: 'unit_type',
      name: 'unit_type',
      label: t(LANGUAGE + '.table.unit_type'),
      placeholder: '',
    },

    {
      id: 'billing_type',
      name: 'billing_type',
      label: t(LANGUAGE + '.table.billing_type'),
      placeholder: '',
    },

    {
      id: 'quantity',
      name: 'quantity',
      label: t(LANGUAGE + '.table.quantity'),
      placeholder: '',
    },

    {
      id: 'price',
      name: 'price',
      label: t(LANGUAGE + '.table.price'),
      placeholder: '',
    },

    {
      id: 'start_date',
      name: 'start_date',
      label: t(LANGUAGE + '.table.start_date'),
      placeholder: '',
    },

    {
      id: 'end_date',
      name: 'end_date',
      label: t(LANGUAGE + '.table.end_date'),
      placeholder: '',
    },
    {
      id: 'description',
      name: 'description',
      label: t(LANGUAGE + '.table.description'),
      placeholder: '',
    },
    {
        id: 'is_active',
        name: 'is_active',
        label: t(LANGUAGE + '.table.is_active'),
        placeholder: '',
    },
  ];

  return fields.find((x: any) => x.id === field);
}

export const getFilterOptions = (t: any) => {
  return [
    {
      id: 'all',
      name: 'all',
      label: t('status.all'),
      placeholder: '',
    },
    { ...getFields(t, 'name') },
  ];
}

export const formSchema = (t: any, id: number|null = null) => {
  return Yup.object().shape({
    name: Yup.string().required().label(getFields(t, 'name')?.label),
    unit_type: Yup.object()
              .nullable()
              .required()
              .label(getFields(t, 'unit_type')?.label),
    description: Yup.string().max(255).label(getFields(t, 'description')?.label),
    quantity: Yup.number().label(getFields(t, 'quantity')?.label),
    price: Yup.number().label(getFields(t, 'price')?.label),
    start_date: Yup.date().nullable().transform((value, originalValue) =>
                originalValue === '' ? null : value
              ).label(getFields(t, 'start_date')?.label),
    end_date: Yup.date().nullable().transform((value, originalValue) =>
                originalValue === '' ? null : value
              ).label(getFields(t, 'end_date')?.label),
    billing_type: Yup.object()
            .nullable()
            .required()
            .label(getFields(t, 'billing_type')?.label),
    is_active: Yup.boolean(),
  })
}


let formikContext: any = null;
export const formikInstance = { current: null as any };
export const FormikContext = createContext<any>(null);
export const useFormikContext = () => {
    formikContext = useContext(FormikContext);
    if (!formikContext) {
      throw new Error('useFormikContext must be used within a FormikProvider');
    }
    return formikContext;
};
export const useFormik = (props: any) => {
  const [submitted, setSubmitted] = React.useState(false);

  const formik = useFormikOriginal({ ...props, validateOnChange: submitted });
  formikInstance.current = formik;

  React.useEffect(() => {
    if (formik.submitCount > 0) {
      setSubmitted(true);
    }
  }, [formik.submitCount]);

  React.useEffect(() => {
    if (formik.submitCount <= 0) {
      if(props && props.onChangeBeforeSubmit){
        props.onChangeBeforeSubmit();
      }
    }
  }, [formik.values]);

  const resetSubmitted = React.useCallback(() => {
    setSubmitted(false);
  }, []);

  const setSubmittedManually = React.useCallback((value: boolean) => {
    setSubmitted(value);
  }, []);

  return {
    ...formik,
    submitted,
    resetSubmitted,
    setSubmitted: setSubmittedManually,
  };
};


export const prepareForm = (values: any = null, defValues: any = null) => {
  let form = _.cloneDeep(values);
  let data = _.cloneDeep(defValues);

  if(data && form){
    data['name'] = form?.name || '';
    data['description'] = form?.description || '';
    data['unit_type'] = getUnitTypes().find((option: any) => option.id === form?.unit_type) || null;
    data['quantity'] = form?.quantity || '';
    data['price'] = form?.price || '';
    data['start_date'] = form?.start_date || '';
    data['end_date'] = form?.end_date || '';
    data['billing_type'] = getBillingTypes().find((option: any) => option.id === form?.billing_type) || null;
    data['is_active'] = form?.is_active || false;
  }

  return data;
};

export const prepareData = (values: any = null, id: number|null) => {
  let data: any = {};

  if(values){
    data['name'] = values?.name || '';
    data['description'] = values?.description || '';
    data['unit_type'] = values?.unit_type?.id || '';
    data['quantity'] = values?.quantity || '';
    data['price'] = values?.price || '';
    data['start_date'] = values?.start_date || '';
    data['end_date'] = values?.end_date || '';
    data['billing_type'] = values?.billing_type?.id || '';
    data['is_active'] = values?.is_active || false;

    if (isNumeric(id)) {
      data['id'] = id;
    }
  }

  return data;
};

export const getUnitTypeLabel = (unitType: string, t: any) => {
  switch (unitType) {
    case UnitType.Apartment:
      return t('building.details.apartment');

    case UnitType.Basement:
      return t('building.details.basement');

    case UnitType.Attic:
      return t('building.details.attic');

    case UnitType.Commercial:
      return t('building.details.commercial');

    case UnitType.Garage:
      return t('building.details.garage');
      
    case UnitType.GarageSpot:
      return t('building.details.garage_spot');

    case UnitType.Office:
      return t('building.details.office');

    case UnitType.Storage:
      return t('building.details.storage');

    case UnitType.Common:
      return t('building.details.common');

    case UnitType.BoilerRoom:
      return t('building.details.boiler_room');

    case UnitType.LaundryRoom:
      return t('building.details.laundry_room');

    case UnitType.SecurityRoom:
      return t('building.details.security_room');

    case UnitType.TechnicalRoom:
      return t('building.details.technical_room');

    case UnitType.ParkingSpace:
      return t('building.details.parking_space');

    case UnitType.Other:
      return t('building.details.other');

    default:
      return '-';
  }
};

export const getBillingTypeLabel = (billingType: string, t: any) => {
  switch (billingType) {
    case BillingType.PerUnit:
      return t('billableService.label.per_unit');

    case BillingType.PerArea:
        return t('billableService.label.per_area');

    case BillingType.PerPerson:
      return t('billableService.label.per_person');

    case BillingType.PerMass:
      return t('billableService.label.per_mass');

    case BillingType.PerHour:
      return t('billableService.label.per_hour');

    case BillingType.PerKwh:
      return t('billableService.label.per_kwh');

    default:
      return '-';
  }
}

export const renderField = (label: string, value: any, options: { xs: number, sm: number, md: number } = { xs: 12, sm: 6, md: 4 }) => (
  <Grid item xs={options?.xs} sm={options?.sm} md={options?.md}>
    <ListItemText
      primary={value || '-'}
      secondary={label}
      primaryTypographyProps={{ typography: 'body2' }}
      secondaryTypographyProps={{
        component: 'span',
        typography: 'caption',
        color: 'text.disabled',
      }}
    />
  </Grid>
);


export interface initialValuesStruct {
    name: string,
    description: string,
    unit_type: any,
    quantity: number|null,
    price: number|null,
    start_date: string|null,
    end_date: string|null,
    billing_type: any,
    is_active: boolean,
};
export const initialValues: initialValuesStruct = {
  name: '',
  description: '',
  unit_type: null,
  quantity: 1,
  price: 1,
  start_date: '',
  end_date: '',
  billing_type: null,
  is_active: true,
};


interface InitState {
  isLoading: boolean,
  show: boolean,
  id: number|null,
  payload: any,
  details: any,
  items: Array<any>,
}

function NewReducer() {
  const initialState: InitState = {
    isLoading: false,
    show: false,
    id: null,
    payload: null,
    details: null,
    items: [],
  };


  const reducers = {
    resetSlice: () => {
      return initialState;
    },
    setLoading: (state: InitState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setShow: (state: InitState, action: PayloadAction<{ show: boolean, id: number|null, payload: any }>) => {
      state.id = action.payload.id;
      state.payload = action.payload.payload;
      state.show = action.payload.show;
    },

    startRead: (state: InitState) => {
      state.isLoading = true;
      state.items = [];
    },
    finishRead: (state: InitState, action: PayloadAction<any>) => {
      let data = (action.payload && action.payload.data && action.payload.data.length > 0) ? action.payload.data : [];
      state.items = data;
      state.isLoading = false;
    },

    startDetails: (state: InitState) => {
      state.isLoading = true;
    },
    finishDetails: (state: InitState, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.details = action.payload;
    },

    start: (state: InitState) => {
      state.isLoading = true;
    },
    finish: (state: InitState, action: PayloadAction<any>) => {
      state.isLoading = false;
    },
  };


  const apis = {
    callReadApi: (params: any, callback: (state: boolean, data: any, message: string) => void) => async (dispatch: any) => {
      dispatch(actions.startRead());

      await axios.get(API, { params: params }).then((result: any) => {
        const { data, message } = result.data;

        callback(true, data, message);
        dispatch(actions.finishRead(data));
      }).catch((error: any) => {
        const { message } = error;

        callback(false, null, message);
        dispatch(actions.finishRead(null));
      });
    },

    callDetailsApi: (id: number|null, callback: (state: boolean, data: any, message: string) => void) => async (dispatch: any) => {
      dispatch(actions.startDetails());

      await axios.get(API + '/' + id).then((result: any) => {
        const { data, message } = result.data;

        callback(true, data, '');
        dispatch(actions.finishDetails(data));
      }).catch((error: any) => {
        const { message } = error;

        callback(false, null, message);
        dispatch(actions.finishDetails(null));
      });
    },

    callCreateApi: (params: any, callback: (state: boolean, data: any, message: string) => void) => async (dispatch: any) => {
      dispatch(actions.start());

      await axios.post(API, params).then((result: any) => {
        const { data, message } = result.data;

        callback(true, data, message);
        dispatch(actions.finish(data));
      }).catch((error: any) => {
        const { message } = error;

        callback(false, null, message);
        dispatch(actions.finish(null));
      });
    },

    callUpdateApi: (params: any, callback: (state: boolean, data: any, message: string) => void) => async (dispatch: any) => {
      dispatch(actions.start());

      await axios.put(API + '/' + params?.id, params).then((result: any) => {
        const { data, message } = result.data;

        callback(true, data, message);
        dispatch(actions.finish(data));
      }).catch((error: any) => {
        const { message } = error;

        callback(false, null, message);
        dispatch(actions.finish(null));
      });
    },

    callDeleteApi: (params: any, callback: (state: boolean, data: any, message: string) => void) => async (dispatch: any) => {
      dispatch(actions.start());

      await axios.delete(API + '/' + params?.id, { data: params }).then((result: any) => {
        const { data, message } = result.data;

        callback(true, data, message);
        dispatch(actions.finish(data));
      }).catch((error: any) => {
        const { message } = error;

        callback(false, null, message);
        dispatch(actions.finish(null));
      });
    },
  };


  const { reducer, actions } = createSlice({
    name,
    initialState,
    reducers,
  });


  return {
    reducer,
    ...actions,
    ...apis,
  };
}


export default NewReducer();
