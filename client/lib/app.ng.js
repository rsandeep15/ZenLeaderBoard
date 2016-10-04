angular.module('ZenLeaderBoard', ['angular-meteor', 'angularUtils.directives.dirPagination']).run(function($rootScope){
	$rootScope.UTIL = {
		createSort: function(criteria, order)
		{
		    var criteriaMap = {"Account ID":"acctId", "Transaction Code":"tranCode", "Base Currency":"baseCurrency", 
			"Currency":"currency", "Amount":"amount", "Time Stamp":"timeStamp"};
			var field = criteriaMap[criteria];  
        	var modifiedSort = {};
        	modifiedSort[field] = parseInt(order);
        	return modifiedSort;   
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
function onReady(){
	angular.bootstrap(document, ['ZenLeaderBoard']);
}

if(Meteor.isCordova)
	angular.element(document).on("deviceready", onReady);
else
	angular.element(document).ready(onReady);
