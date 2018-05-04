import React, { Component } from "react";

import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
    winner: ""
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({
      message: "We are in the process of submitting your entry"
    });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });

    this.setState({ message: "You have been entered successfully!" });
  };

  pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "We are selecting a winner....." });

    await lottery.methods.pickWinner().send({ from: accounts[0] });

    this.setState({ message: `A winner has been picked!` });
  };

  render() {
    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>
          {" "}
          This contract is managed by {this.state.manager}
          <br />
          There are currently {this.state.players.length} people competing to
          win {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck</h4>
          <div>
            <label htmlFor="">Amount of ether to enter</label>
            <input
              type="text"
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button type="submit">Enter</button>
        </form>
        <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.pickWinner}>Pick A Winner</button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
