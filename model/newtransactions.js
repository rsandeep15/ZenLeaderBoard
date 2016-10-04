NewTransactions = new FS.Collection("newtransactions", {
	stores: [
		new FS.Store.GridFS("jsons")
	],
	filter: {
		allow:{
			extensions: ['json']
		}
	}
}); 

if(Meteor.isServer){
	NewTransactions.allow({
		insert: function (){
			return true; 
		},
		remove: function(){
			return true; 
		},
		download: function(){
			return true; 
		},
		update: function(){
			return true; 
		}
	});

	Meteor.publish('newtransactions', function(){
		return NewTransactions.find({}); 
	});
}