import {
  CHANGE_ACCOUNT,
  SET_BALANCES,
  ADD_TOKEN,
  REMOVE_TOKEN,
  SET_ETH_BALANCE,
  SET_WEB3_PROVIDER,
} from "./types";

export const changeAccount = (account) => {
  return {
    type: CHANGE_ACCOUNT,
    payload: account,
  };
};

const fetchAccountBalances = async (account, tokensList, web3, contractABI) => {
  const newBalances = [];
  if (!web3.utils.isAddress(account)) {
    return newBalances;
  }
  for (let token of tokensList) {
    const contract = new web3.eth.Contract(contractABI, token.address);
    const balance = await contract.methods.balanceOf(account).call();
    const formatedBalance = web3.utils.fromWei(balance);
    newBalances.push(formatedBalance);
  }
  return newBalances;
};

export const setBalances = (account, tokensList, web3, contractABI) => {
  return async (dispatch) => {
    const newBalances = await fetchAccountBalances(
      account,
      tokensList,
      web3,
      contractABI
    );
    dispatch({
      type: SET_BALANCES,
      payload: newBalances,
    });
  };
};

export const addToken = (tokenAddress, tokenName = "") => {
  return {
    type: ADD_TOKEN,
    payload: { name: tokenName, address: tokenAddress },
  };
};

export const removeToken = (tokenAddress) => {
  return {
    type: REMOVE_TOKEN,
    payload: tokenAddress,
  };
};

const getAccountBalance = async (account, web3) => {
  if (account) {
    const balance = await web3.eth.getBalance(account);
    const formatedBalance = web3.utils.fromWei(balance);
    return formatedBalance;
  }
  return "";
};

export const setEthBalance = (account, web3) => {
  return async (dispatch) => {
    const newBalance = await getAccountBalance(account, web3);
    dispatch({
      type: SET_ETH_BALANCE,
      payload: newBalance,
    });
  };
};

export const setWeb3Provider = (providerURL) => {
  return {
    type: SET_WEB3_PROVIDER,
    payload: providerURL,
  };
};
