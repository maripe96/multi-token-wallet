import Web3 from "web3";
import { SET_WEB3_PROVIDER } from "../actions/types";
import INFURA_NODES from "../helpers/INFURA_NODES";

const INITIAL_STATE = new Web3(INFURA_NODES.Mainnet);

const web3Reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_WEB3_PROVIDER:
      return new Web3(action.payload);
    default:
      return state;
  }
};

export default web3Reducer;
