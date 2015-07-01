  Meteor.startup(function () {
  		if (Transactions.find().count() == 0)
  		{
  			console.log("Starting Up");
  			var transactionData = Assets.getText("trans_sample.json");
  			var documentArray = transactionData.split("\n"); 
  			for (index = 0; index < documentArray.length; index++ ){
  				var doc = documentArray[index];
  				console.log(doc);
  				var newJSONDoc = JSON.parse(doc); 
  				Transactions.insert(newJSONDoc); 	
  			}
  		}
  });