module.exports.growl = {
  watching : {
    message : "Watch task started ",
    title : "Watch Notification",
    image : __dirname + '/../../grunt/img/' + 'checkmark' + '.png'
  },
  npmInstallStart: {
    message:"About to run npm install. This may take awhile if you are not updated. ",
    title: "npm install",
    image: __dirname + '/../../grunt/img/' + 'checkmark' + '.png'
  },
  npmInstallComplete: {
    message: "Done with npm update",
    title: "npm install",
    image: __dirname + '/../../grunt/img/' + 'checkmark' + '.png'
  }
};