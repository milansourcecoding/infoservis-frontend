import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

import removeSlice from './slice/remove/removeSlice.tsx';
import listSlice from './slice/form/listSlice.tsx';
import viewSlice from './slice/form/viewSlice.tsx';
import settings from '../pages/settings/redux/settings.tsx';
import selectAutocompleteSlice from '../components/autocomplete/selectAutocompleteSlice.tsx';

import kategorijaReduxSlice from '../pages/sifarnici/kategorija/reduxSlice.tsx';
import radnikReduxSlice from '../pages/sifarnici/radnik/reduxSlice.tsx';
import upravnikReduxSlice from '../pages/sifarnici/upravnik/reduxSlice.tsx';


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    removeSlice: removeSlice.reducer,
    listSlice: listSlice.reducer,
    viewSlice: viewSlice.reducer,
    settings: settings.reducer,
    selectAutocompleteSlice: selectAutocompleteSlice.reducer,

    kategorijaReduxSlice: kategorijaReduxSlice.reducer,
    radnikReduxSlice: radnikReduxSlice.reducer,
    upravnikReduxSlice: upravnikReduxSlice.reducer,
  },
});

export { store };

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch = () => useDispatch<AppDispatch>();
