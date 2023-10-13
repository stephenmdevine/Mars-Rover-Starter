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
      for (let i = 0; i < sentCommands.length; i++) {
         let completedBoolean = true;
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
            completedBoolean = false;
         }
         let input = {
            "completed": completedBoolean,
            ...(statusBoolean && {"roverStatus": currentStatus})
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