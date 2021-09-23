import React from "react";
import { Navbar, Container, Col } from "react-bootstrap";
import { connect } from "react-redux";

class NavbarCustom extends React.Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark" className="justify-content-center">
        <Container>
          <Col xs={4}>
            <Navbar.Brand>Multi Token Wallet</Navbar.Brand>
          </Col>
          <Col xs={4}>
            <Navbar.Collapse className="justify-content-center">
              <Navbar.Text>{this.props.ethBalance} ETH</Navbar.Text>
            </Navbar.Collapse>
          </Col>
          <Col xs={4}>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>{this.props.account}</Navbar.Text>
            </Navbar.Collapse>
          </Col>
        </Container>
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(NavbarCustom);
