const Message = require('./message.js');
const Command = require('./command.js');

class Rover {
   // Write code here!
   constructor(position, mode = "NORMAL", generatorWatts = 110) {
      this.position = position;
      this.mode = mode;
      this.generatorWatts = generatorWatts
   }

   receiveMessage(message) {
      let sentCommands = message.commands;
      let responseCommands = [];
      if (!Array.isArray(sentCommands)) {
         sentCommands = [sentCommands];   // Makes sure Commmands are in array form
      }
      // Loops through the array of commands sent to the rover and applies changes if one of the three command types is issued
      for (let i = 0; i < sentCommands.length; i++) {
         let completedBoolean = true;     // Variable for the 'completed' key in the rover's response
         let statusBoolean = sentCommands[i].commandType === "STATUS_CHECK";
         let currentStatus = {};
         if (sentCommands[i].commandType === "MODE_CHANGE") {
            completedBoolean = (sentCommands[i].value === "NORMAL" || sentCommands[i].value === "LOW_POWER");
            this.mode = sentCommands[i].value;
         }  else if (sentCommands[i].commandType === "MOVE") {
            completedBoolean = (this.mode === "NORMAL");
            if (completedBoolean) {
               this.position = sentCommands[i].value;
            }
         }  else if (sentCommands[i].commandType === "STATUS_CHECK") {
            currentStatus = {"mode": this.mode, "generatorWatts": this.generatorWatts, "position": this.position};
            completedBoolean = statusBoolean;
         }  else {
            completedBoolean = false; // Indicates a command is not completed if one of the three command types isn't issued
         }
         let input = {
            "completed": completedBoolean,
            ...(statusBoolean && {"roverStatus": currentStatus})  // If applicable, adds 'Status Check' to the rover's results' response
         };
         responseCommands.push(input);
      }
      let response = {
         "message": message.name,
         "results": responseCommands
      };
      return response;
   }
}


module.exports = Rover;