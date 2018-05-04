const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { interface, bytecode } = require("../compile");

const provider = ganache.provider();
const web3 = new Web3(provider);

let fetchedAccounts;
let inbox;

beforeEach(async () => {
  // Get a list of all accounts
  fetchedAccounts = await web3.eth.getAccounts();
  // Use an account to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ["Hi There"]
    })
    .send({ from: fetchedAccounts[0], gas: "1000000" });

  inbox.setProvider(provider);
});

describe("Inbox Contract", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });

  it("initializes correctly", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, "Hi There");
  });

  it("modifies message correctly", async () => {
    await inbox.methods
      .setMessage("New Message")
      .send({ from: fetchedAccounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, "New Message");
  });
});
