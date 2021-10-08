import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import SendERC20TokensForm from "./SendERC20TokensForm";
import SendETHForm from "./SendETHForm";

class SendTabs extends React.Component {
  render() {
    return (
      <Tabs
        defaultActiveKey="eth"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="eth" title="ETH">
          <SendETHForm />
        </Tab>
        <Tab eventKey="token" title="ERC20 Token">
          <SendERC20TokensForm />
        </Tab>
      </Tabs>
    );
  }
}

export default SendTabs;
