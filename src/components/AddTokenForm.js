import React from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import Web3 from "web3";
import { addToken } from "../actions";

const web3 = new Web3();

// Input validation functions

const validateTokenName = (name) => {
  let error = undefined;
  if (!name) {
    error = "Please enter a name";
  }
  return error;
};

class AddTokenForm extends React.Component {
  validateTokenAddress = (address) => {
    let error = undefined;
    if (!web3.utils.isAddress(address)) {
      error = "Invalid contract address";
    } else if (
      this.props.tokensList.find((token) => token.address === address)
    ) {
      error = "Token alread in list";
    }
    return error;
  };

  renderError = (meta) => {
    if (meta.touched && meta.error) {
      return <Form.Text className="text-danger">{meta.error}</Form.Text>;
    }
  };

  renderAddressInput = (formProps) => {
    return (
      <Form.Group>
        <Form.Label>Address</Form.Label>
        <Form.Control type="text" autoComplete="off" {...formProps.input} />
        {this.renderError(formProps.meta)}
      </Form.Group>
    );
  };

  renderNameInput = (formProps) => {
    return (
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" autoComplete="off" {...formProps.input} />
        {this.renderError(formProps.meta)}
      </Form.Group>
    );
  };

  onSubmit = (formValues) => {
    this.props.addToken(formValues.address, formValues.name);
  };

  render() {
    return (
      <FinalForm
        onSubmit={this.onSubmit}
        render={({ handleSubmit }) => (
          <Form name="addTokenForm" onSubmit={handleSubmit}>
            <Field
              name="address"
              component={this.renderAddressInput}
              validate={this.validateTokenAddress}
            />
            <Field
              name="name"
              component={this.renderNameInput}
              validate={validateTokenName}
            />
            <Button className="mt-3" type="submit">
              Add
            </Button>
          </Form>
        )}
      />
    );
  }
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps, { addToken })(AddTokenForm);
