angular.module("ZenLeaderBoard").controller("StatsTableCtrl", ['$scope', '$meteor', function($scope, $meteor)
{
	
	$scope.distribution = function(){
	  var percentages = [];
      for (var i =0; i < currencies.length; i++)
      {
        var currency = currencies[i];
        var totalTransactions = Transactions.find().count();
        var currencyCount = Transactions.find({"items.currency":currency}).count(); 
        var percentage = ((currencyCount/totalTransactions)* 100 ).toFixed(1) + "%";
        percentages.push({'currency':currencyMap[currency], 'count': currencyCount, 'percentage': percentage});
      }
      return percentages; 
	}
}
]); 