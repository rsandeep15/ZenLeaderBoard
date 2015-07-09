angular.module('ZenLeaderBoard', ['angular-meteor']).run(function($rootScope){
	$rootScope.UTIL = {
		createSort: function(criteria, order)
		{
		    var criteriaMap = {"Account ID":"items.acctId", "Transaction Code":"items.tranCode", "Base Currency":"baseCurrency", 
			"Currency":"items.currency", "Amount":"items.amount", "Time Stamp":"timeStamp"};
			var field = criteriaMap[criteria];  
        	var modifiedSort = {};
        	modifiedSort[field] = parseInt(order);
        	return modifiedSort;   
		},
		formatDate: function(thisDate){
			return moment(thisDate).format('MMM Do, YYYY h:mm:ss a'); 
		},
		fixAmount: function(amount){
			var amount = amount + ""; 
			var index = amount.indexOf("#");
			if (amount !== "Unknown" && index >= 0)
			{
			  return amount.substring(0, index); 
			}
			else
			{
			  if (amount !== "Unknown")
			  {
			    return parseFloat(amount).toFixed(2); 
			  }
			  else
			  {
			    return amount; 
			  }
			}
		}

	}
}); 
