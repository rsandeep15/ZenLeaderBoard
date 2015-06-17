Transactions = new Mongo.Collection("Transactions");

if (Meteor.isClient) {
  Template.zenleaderboard.helpers({
    transaction: function(){
      return Transactions.find();
    },
    acctIds: function(){
      return Transactions.find({}, {items:1});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

  });
}
