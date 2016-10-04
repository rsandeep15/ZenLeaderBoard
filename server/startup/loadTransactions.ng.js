  Meteor.startup(function () {
  		if (Transactions.find().count() == 0)
  		{
  			console.log("Starting Up. Loading Transactions to Mongo Database...");
  			var TransactionsData = Assets.getText("trans_sample.json").trim();
        	Meteor.call("addTransactions", TransactionsData)
        	console.log("Transactions have been loaded"); 
  		}
  });