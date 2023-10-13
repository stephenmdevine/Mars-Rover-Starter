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
      let responseCommands = [];
      for (let i = 0; i < message.commands.length; i++) {
         const trueCondition = (message.commands[i].commandType === "STATUS_CHECK");
         let completedTruth = true;
         if (message.commands[i].commandType === "MODE_CHANGE") {
            completedTruth = (message.commands[i].value === "NORMAL" || message.commands[i].value === "LOW_POWER");
            this.mode = message.commands[i].value;
         }  else if (message.commands[i].commandType === "MOVE") {
            if (this.mode === "NORMAL") {
               this.position = message.commands[i].value;
            }
            completedTruth = (this.mode === "NORMAL");
         }
         let currentStatus = {"mode": this.mode, "generatorWatts": this.generatorWatts, "position": this.position};
         let input = {
            "completed": completedTruth,
            ...(trueCondition && {roverStatus: currentStatus})
         };
         responseCommands.push(input);
      }
      let response = {
         "message": message.name,
         "results": responseCommands
      };
      console.log(response.results);
      return response;
   }
}


module.exports = Rover;