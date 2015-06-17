Transactions = new Mongo.Collection("Transactions");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.zenleaderboard.helpers({
    counter: function () {
      return Session.get('counter');
    },
    transaction: function(){
      return Transactions.find();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

  });
}
