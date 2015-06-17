Transactions = new Mongo.Collection("Transactions");

if (Meteor.isClient) {
  Template.zenleaderboard.helpers({
    transaction: function(){
      return Transactions.find();
    },
    search: function(text, detail){
      // Search Algorithm
    },
    sort: function(detail){
      // Sort Algorithm 
    },
    counter: function(){
      return Transactions.count({})
    } 
  });
  
  Template.searchForm.events({
    'submit form':function(event)
    {
      event.preventDefault();
      var transactionVar = event.target.transaction.value;
      console.log(transactionVar);
      console.log(document.getElementById("criteria").value);
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

  });
}
