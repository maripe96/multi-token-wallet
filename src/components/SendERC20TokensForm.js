import React from "react";
import { connect } from "react-redux";
import { Form, Button, Spinner } from "react-bootstrap";
import { Form as FinalForm, Field } from "react-final-form";
import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
import ERC20Build from "../helpers/ERC20Build.json";

const web3 = new Web3();

const validateAddress = (account) => {
  let error = undefined;
  if (!web3.utils.isAddress(account)) {
    error = "Invalid address";
  }
  return error;
};

const validateValue = (value) => {
  let error = undefined;
  if (!value) {
    error = undefined;
  } else if (isNaN(value)) {
    error = "Invalid value";
  }
  return error;
};

class SendERC20TokensForm extends React.Component {
  state = {
    sending: false,
    sendError: null,
    finishedTransaction: null,
  };

  renderError = (meta) => {
    if (meta.touched && meta.error) {
      return <Form.Text className="text-danger">{meta.error}</Form.Text>;
    }
  };

  validatePrivateKey = (privateKey) => {
    let error = undefined;
    if (!this.props.account) {
      error = "Please set an account first";
    } else if (!privateKey) {
      error = "Please enter a private key";
    }
    return error;
  };

  renderTokenAddressInput = (formProps) => {
    return (
      <Form.Group className="mb-3">
        <Form.Label>Token Address</Form.Label>
        <Form.Control
          type="text"
          autoComplete="off"
          {...formProps.input}
          placeholder="Address"
        />
        <div>{this.renderError(formProps.meta)}</div>
      </Form.Group>
    );
  };

  renderValueInput = (formProps) => {
    return (
      <Form.Group className="mb-3">
        <Form.Label>Value</Form.Label>
        <Form.Control
          type="text"
          autoComplete="off"
          {...formProps.input}
          placeholder="Tokens"
        />
        <div>{this.renderError(formProps.meta)}</div>
      </Form.Group>
    );
  };

  renderSendToInput = (formProps) => {
    return (
      <Form.Group className="mb-3">
        <Form.Label>Send to</Form.Label>
        <Form.Control
          type="text"
          autoComplete="off"
          {...formProps.input}
          placeholder="Address"
        />
        <div>{this.renderError(formProps.meta)}</div>
      </Form.Group>
    );
  };

  renderGasPriceInput = (formProps) => {
    return (
      <Form.Group className="mb-3">
        <Form.Label>Gas Price [Gwei]</Form.Label>
        <Form.Control
          type="text"
          autoComplete="off"
          {...formProps.input}
          placeholder="Gas Price [Gwei]"
        />
        <div>{this.renderError(formProps.meta)}</div>
      </Form.Group>
    );
  };

  renderGasLimitInput = (formProps) => {
    return (
      <Form.Group className="mb-3">
        <Form.Label>Gas Limit</Form.Label>
        <Form.Control
          type="text"
          autoComplete="off"
          {...formProps.input}
          placeholder="Gas Limit"
        />
        <div>{this.renderError(formProps.meta)}</div>
      </Form.Group>
    );
  };

  renderPrivateKeyInput = (formProps) => {
    return (
      <Form.Group className="mb-3">
        <Form.Label>Private key</Form.Label>
        <Form.Control
          type="text"
          autoComplete="off"
          {...formProps.input}
          placeholder="Private key"
        />
        <div>{this.renderError(formProps.meta)}</div>
      </Form.Group>
    );
  };

  renderSendMessage = () => {
    if (this.state.sending) {
      return (
        <div className="mt-3">
          <Spinner />
          Sending...
        </div>
      );
    } else if (this.state.sendError) {
      return <div className="mt-3">Error: {this.state.sendError.message}</div>;
    } else if (this.state.finishedTransaction) {
      return (
        <div>
          <div className="mt-3">
            Transaction Hash: {this.state.finishedTransaction.transactionHash}
          </div>
          <div>Gas Used: {this.state.finishedTransaction.gasUsed}</div>
        </div>
      );
    }
  };

  sendERC20Token = async (formValues) => {
    this.setState({
      sending: true,
      sendError: null,
      finishedTransaction: null,
    });
    try {
      const web3State = this.props.web3;

      const privateKey = "0x" + formValues.privateKey;

      const from = this.props.account;
      const to = formValues.sendTo;
      const valueInERC20Tokens = formValues.value;

      const provider = new HDWalletProvider(
        privateKey,
        web3State.currentProvider.host
          ? web3State.currentProvider.host
          : web3State.currentProvider.url
      );

      const tokenTransferWeb3 = new Web3(provider);

      let contract = new tokenTransferWeb3.eth.Contract(
        ERC20Build.abi,
        formValues.tokenAddress
      );

      const estimateGas = await contract.methods
        .transfer(formValues.sendTo, valueInERC20Tokens)
        .estimateGas({ from });
      const estimateGasPrice = await web3State.eth.getGasPrice();

      let gasPrice = formValues.gasPrice
        ? web3State.utils.toWei(formValues.gasPrice, "gwei")
        : estimateGasPrice;
      let gasLimit = formValues.gasLimit ? formValues.gasLimit : estimateGas;

      contract = new tokenTransferWeb3.eth.Contract(
        ERC20Build.abi,
        formValues.tokenAddress,
        { from, gasPrice, gas: gasLimit }
      );

      const sentTransaction = await contract.methods
        .transfer(to, valueInERC20Tokens)
        .send({ from });

      this.setState({
        sending: false,
        sendError: null,
        finishedTransaction: sentTransaction,
      });
    } catch (error) {
      this.setState({ sending: false, sendError: error });
    }
  };

  render() {
    return (
      <FinalForm
        onSubmit={this.sendERC20Token}
        render={({ handleSubmit }) => (
          <Form name="sendERC20TokenForm" onSubmit={handleSubmit}>
            <Field
              name="tokenAddress"
              component={this.renderTokenAddressInput}
              validate={validateAddress}
            />
            <Field
              name="value"
              component={this.renderValueInput}
              validate={validateValue}
            />
            <Field
              name="sendTo"
              component={this.renderSendToInput}
              validate={validateAddress}
            />
            <Field
              name="gasPrice"
              component={this.renderGasPriceInput}
              validate={validateValue}
            />
            <Field
              name="gasLimit"
              component={this.renderGasLimitInput}
              validate={validateValue}
            />
            <Field
              name="privateKey"
              component={this.renderPrivateKeyInput}
              validate={this.validatePrivateKey}
            />

            <Button variant="primary" type="submit">
              Send
            </Button>

            {this.renderSendMessage()}
          </Form>
        )}
      />
    );
  }
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(SendERC20TokensForm);
