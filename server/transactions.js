  Meteor.publish("transactions", function(options){
    return Transactions.find({}, options); 
  }); 