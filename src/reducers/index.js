import { combineReducers } from "redux";
import accountReducer from "./accountReducer";
import web3Reducer from "./web3Reducer";
import tokensListReducer from "./tokensListReducer";
import balancesReducer from "./balancesReducer";
import ethBalanceReducer from "./ethBalanceReducer";
import networkReducer from "./networkReducer";

export default combineReducers({
  account: accountReducer,
  web3: web3Reducer,
  tokensList: tokensListReducer,
  balances: balancesReducer,
  ethBalance: ethBalanceReducer,
  network: networkReducer,
});
