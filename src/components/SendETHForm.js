import React from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { Form as FinalForm, Field } from "react-final-form";
import { connect } from "react-redux";
import Web3 from "web3";
const EthereumTx = require("ethereumjs-tx").Transaction;

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
    error = "Please input a value";
  } else if (isNaN(value)) {
    error = "Invalid value";
  }
  return error;
};

class SendETHForm extends React.Component {
  state = { sending: false };

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

  renderValueInput = (formProps) => {
    return (
      <Form.Group className="mb-3">
        <Form.Label>Value</Form.Label>
        <Form.Control
          type="text"
          autoComplete="off"
          {...formProps.input}
          placeholder="ETH"
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
        <Form.Label>Gas</Form.Label>
        <Form.Control
          type="text"
          autoComplete="off"
          {...formProps.input}
          placeholder="Gas"
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
    }
  };

  sendEth = async (formValues) => {
    this.setState({ sending: true });
    const web3State = this.props.web3;

    const privateKey = Buffer.from(formValues.privateKey, "hex");

    const from = this.props.account;
    const to = formValues.sendTo;
    const valueInEther = formValues.value;
    const estimateGas = await web3State.eth.estimateGas({
      from,
      to,
      amount: web3State.utils.toWei(valueInEther, "ether"),
    });
    const gasPrice = estimateGas;
    const gasLimit = estimateGas * 10;

    const txnCount = await web3State.eth.getTransactionCount(from, "pending");

    let rawTx = {
      nonce: web3State.utils.numberToHex(txnCount),
      from,
      to,
      value: web3State.utils.numberToHex(
        web3State.utils.toWei(valueInEther, "ether")
      ),
      gasLimit: web3State.utils.numberToHex(gasLimit),
      gasPrice: web3State.utils.numberToHex(gasPrice),
    };

    const tx = new EthereumTx(rawTx, { chain: "ropsten" });
    console.log(tx);
    tx.sign(privateKey);

    const serializedTx = tx.serialize();

    const finishedTransaction = await web3State.eth.sendSignedTransaction(
      "0x" + serializedTx.toString("hex")
    );

    console.log(finishedTransaction);
    console.log("END");
  };

  render() {
    return (
      <FinalForm
        onSubmit={this.sendEth}
        render={({ handleSubmit }) => (
          <Form name="sendETHForm" onSubmit={handleSubmit}>
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

export default connect(mapStateToProps)(SendETHForm);
