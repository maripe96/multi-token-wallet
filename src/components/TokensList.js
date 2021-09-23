import React from "react";
import { Table, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { setBalances, removeToken } from "../actions";

class TokensList extends React.Component {
  onClickRemoveToken = (token) => {
    this.props.removeToken(token.address);
  };

  renderTokensList = (tokensList, balances) => {
    return tokensList.map((token) => {
      return (
        <tr key={token.address}>
          <td>
            {this.props.removing ? (
              <Button
                onClick={this.onClickRemoveToken.bind(this, token)}
                variant="danger"
                size="sm"
              />
            ) : (
              ""
            )}
            {token.name}
          </td>
          <td>{token.address}</td>
          <td>{balances ? balances[tokensList.indexOf(token)] : ""}</td>
        </tr>
      );
    });
  };

  render() {
    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {this.renderTokensList(this.props.tokensList, this.props.balances)}
        </tbody>
      </Table>
    );
  }
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps, { setBalances, removeToken })(
  TokensList
);
