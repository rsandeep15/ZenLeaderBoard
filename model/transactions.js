Transactions = new Mongo.Collection("Transactions"); 
Transactions.allow({
	remove: function(transaction){
		return true; 
	}
});