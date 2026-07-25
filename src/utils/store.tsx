import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

import removeSlice from './slice/remove/removeSlice.tsx';
import listSlice from './slice/form/listSlice.tsx';
import viewSlice from './slice/form/viewSlice.tsx';
import settings from '../pages/settings/redux/settings.tsx';
import selectAutocompleteSlice from '../components/autocomplete/selectAutocompleteSlice.tsx';

import usersSlice, { name as usersSliceName} from '../pages/users/slice.tsx';
import buildingSlice, { name as buildingSliceName} from '../pages/building/slice.tsx';
import organizationSlice, { name as organizationSliceName} from '../pages/organization/slice.tsx';


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    removeSlice: removeSlice.reducer,
    listSlice: listSlice.reducer,
    viewSlice: viewSlice.reducer,
    settings: settings.reducer,
    selectAutocompleteSlice: selectAutocompleteSlice.reducer,

    [usersSliceName]: usersSlice.reducer,
    [buildingSliceName]: buildingSlice.reducer,
    [organizationSliceName]: organizationSlice.reducer,
  },
});

export { store };

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch = () => useDispatch<AppDispatch>();
