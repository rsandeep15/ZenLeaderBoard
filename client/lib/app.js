angular.module('ZenLeaderBoard', ['angular-meteor', 'angularUtils.directives.dirPagination']).run(function($rootScope){
	$rootScope.UTIL = {
		createSort: function(criteria, order)
		{
		    var criteriaMap = {"Account ID":"items.acctId", "Transaction Code":"items.tranCode", "Base Currency":"baseCurrency", 
			"Currency":"items.currency", "Amount":"items.amount", "Time Stamp":"timeStamp"};
			var field = criteriaMap[criteria];  
        	var modifiedSort = {};
        	modifiedSort[field] = parseInt(order);
        	return modifiedSort;   
		}
	}
}); 
