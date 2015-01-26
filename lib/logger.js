//creating a global server logger
if(Meteor.isClient) return;
logger = Meteor.npmRequire('winston');

