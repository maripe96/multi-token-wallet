import { CHANGE_NETWORK } from "../actions/types";

const INITIAL_STATE = "Mainnet";
const accountReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHANGE_NETWORK:
      return action.payload;
    default:
      return state;
  }
};

export default accountReducer;
