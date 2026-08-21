import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ----------------------------------------------------------------------

export interface InitState {
  show: boolean,
}

function NewReducer() {
  const name = 'uploadDialogSlice';

  const initialState: InitState = {
    show: false,
  };

  const reducers = {
    setShow: (state: InitState, action: PayloadAction<{ show: boolean }>) => {
      state.show = action.payload.show;
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
  };
}

export default NewReducer();