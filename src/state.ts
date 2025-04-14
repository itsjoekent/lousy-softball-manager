import { createContext, useContext, useEffect, useReducer } from "react";
import { State } from "./types";
import { type Action, reducerHandlers } from './actions';

function reducer(state: State, action: Action): State {
  return reducerHandlers[action.type](state, action);
}

const LOCAL_STORAGE_KEY_V1 = "lousy-softball-software-v1";

function getInitialState(): State {
  const v1State = localStorage.getItem(LOCAL_STORAGE_KEY_V1);
  if (v1State) {
    return JSON.parse(v1State) as State;
  }

  return {
    roster: [],
    game: null,
  };
}

export function writeStateToLocalStorage(state: State) {
  localStorage.setItem(LOCAL_STORAGE_KEY_V1, JSON.stringify(state));
}

export function useStateReducer() {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  useEffect(() => {
    writeStateToLocalStorage(state);
  }, [state]);

  return { state, dispatch };
}

export const StateContext = createContext({
  state: getInitialState(),
  dispatch: (action: Action) => {
    console.warn(`No dispatch function provided for action: ${action.type}`);
  },
});

export function useStateContext() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within an StateContext.Provider");
  }
  return context;
}

