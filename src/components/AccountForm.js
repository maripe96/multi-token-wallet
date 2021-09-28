import React from "react";
import { Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { Form as FinalForm, Field } from "react-final-form";
import { connect } from "react-redux";
import Web3 from "web3";
import {
  changeAccount,
  setEthBalance,
  setBalances,
  setWeb3Provider,
  changeNetwork,
} from "../actions";
import ERC20_ABI from "../helpers/ERC20_ABI";
import INFURA_NODES from "../helpers/INFURA_NODES";

const web3 = new Web3();

// Input validation functions

const validateAccount = (account) => {
  let error = undefined;
  if (!web3.utils.isAddress(account)) {
    error = "Invalid account address";
  }

  return error;
};

class AccountForm extends React.Component {
  state = { selectedNetwork: "Mainnet" };

  renderError = (meta) => {
    if (meta.touched && meta.error) {
      return <Form.Text className="text-danger">{meta.error}</Form.Text>;
    }
  };

  renderInput = (formProps) => {
    return (
      <Form.Group>
        <Form.Label>Address</Form.Label>
        <Form.Control
          placeholder="0x..."
          type="text"
          autoComplete="off"
          {...formProps.input}
        />
        <div>{this.renderError(formProps.meta)}</div>
      </Form.Group>
    );
  };

  onSubmit = async (formValues) => {
    this.props.changeAccount(formValues.account);
    this.props.setEthBalance(formValues.account, this.props.web3);
    this.props.setBalances(
      formValues.account,
      this.props.tokensList,
      this.props.web3,
      ERC20_ABI
    );
  };

  handleSelect = async (selectedNetwork) => {
    await this.setState({ selectedNetwork });
    this.props.setWeb3Provider(INFURA_NODES[this.state.selectedNetwork]);
    this.props.changeNetwork(this.state.selectedNetwork);
  };

  renderNetworkSelectorDropdown = () => {
    return (
      <DropdownButton
        className="mt-3"
        title={
          this.state.selectedNetwork ? this.state.selectedNetwork : "Network"
        }
        onSelect={this.handleSelect}
        variant="secondary"
      >
        <Dropdown.Item eventKey="Mainnet">Mainnet</Dropdown.Item>
        <Dropdown.Item eventKey="Ropsten">Ropsten</Dropdown.Item>
        <Dropdown.Item eventKey="Kovan">Kovan</Dropdown.Item>
        <Dropdown.Item eventKey="Rinkeby">Rinkeby</Dropdown.Item>
        <Dropdown.Item eventKey="Goerli">Goerli</Dropdown.Item>
        <Dropdown.Item eventKey="LocalHost8545">Localhost8545</Dropdown.Item>
      </DropdownButton>
    );
  };

  render() {
    return (
      <FinalForm
        onSubmit={this.onSubmit}
        render={({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              name="account"
              component={this.renderInput}
              validate={validateAccount}
            />

            {this.renderNetworkSelectorDropdown()}
            <Button className="mt-3" type="submit">
              Set Account
            </Button>
          </Form>
        )}
      />
    );
  }
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps, {
  changeAccount,
  setEthBalance,
  setBalances,
  setWeb3Provider,
  changeNetwork,
})(AccountForm);
