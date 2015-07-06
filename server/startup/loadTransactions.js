  Meteor.startup(function () {
  		if (Transactions.find().count() == 0)
  		{
  			console.log("Starting Up. Loading Transactions to Mongo Database...");
  			var transactionData = Assets.getText("trans_sample.json").trim();
  			var documentArray = transactionData.split("\n"); 
  			for (index = 0; index < documentArray.length; index++ ){
  				var doc = documentArray[index];
  				// console.log(doc);
  				if (doc != "")
  				{
  					var newJSONDoc = JSON.parse(doc); 
  					Transactions.insert(newJSONDoc); 
  				}	
  			}
        console.log("Transactions have been loaded"); 
  		}
  });