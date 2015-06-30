  Meteor.publish("transactions", function(){
    return Transactions1.find({}); 
  }); 