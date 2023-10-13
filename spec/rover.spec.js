const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", () => {

  // 7 tests here!
  
  test("constructor sets position and default values for mode and generatorWatts", () => {
    let received = new Rover(0);
    expect(received.position).toBe(0);
    expect(received.mode).toEqual("NORMAL");
    expect(received.generatorWatts).toBe(110);
  });

  test("response returned by receiveMessage contains the name of the message", () => {
    let spirit = new Rover(0);
    let messageTest = new Message(" ", []);
    let received = spirit.receiveMessage(messageTest);
    expect(received["message"]).toEqual(" ");
  });

  test("response returned by receiveMessage includes two results if two commands are sent in the message", () => {
    let opportunity = new Rover(0);
    let messageTest = new Message(" ", [0, 1]);
    let received = opportunity.receiveMessage(messageTest);
    expect(received["results"].length).toBe(2);
  });

  test("responds correctly to the status check command", () => {
    let messageTest = new Message(" ", [new Command("STATUS_CHECK")]);
    let pathfinder = new Rover(100);
    let received = pathfinder.receiveMessage(messageTest).results[0].roverStatus;
    let expected = {mode: "NORMAL", generatorWatts: 110, position: 100};
    expect(received).toEqual(expected);
  });

  test("responds correctly to the mode change command", () => {
    let messageTest = new Message(" ", [new Command("MODE_CHANGE", "LOW_POWER")]);
    let sojourner = new Rover(100);
    expect(sojourner.receiveMessage(messageTest).results[0]).toEqual({"completed": true});

    let messageTest2 = new Message(" ", [new Command("MODE_CHANGE", "NORMAL")]);
    expect(sojourner.receiveMessage(messageTest2).results[0]).toEqual({"completed": true});

    let messageTest3 = new Message(" ", [new Command("MODE_CHANGE", "HI_POWER")]);
    expect(sojourner.receiveMessage(messageTest3).results[0]).toEqual({"completed": false});
  });

  test("responds with a false completed value when attempting to move in LOW_POWER mode", () => {
    let messageTest = new Message(" ", [new Command("MODE_CHANGE", "LOW_POWER"), new Command("MOVE", 8)]);
    let perseverance = new Rover(100);
    expect(perseverance.receiveMessage(messageTest).results[1]).toEqual({"completed": false});
  });

  test("responds with the position for the move command", () => {
    let curiosity = new Rover(100);
    let messageTest = new Message(" ", [new Command("MOVE", 420), new Command("STATUS_CHECK")]);
    let received = curiosity.receiveMessage(messageTest);
    expect(received.results[1].roverStatus.position).toBe(420);
  });

});

