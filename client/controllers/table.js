angular.module("ZenLeaderBoard").controller("TableCtrl", ['$scope', '$meteor',
		function($scope, $meteor){
			$scope.fields = ["Account ID", "Transaction Code", "Base Currency", "Currency", "Amount", "Time Stamp"];
			$meteor.subscribe("transactions"); 
			$scope.transactions = $meteor.collection(Transactions1);
			$scope.remove = function(transaction){
				$scope.transactions.splice($scope.transactions.indexOf(transaction), 1); 
			};
			$scope.fixAmount = function(amount){
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
			};
			$scope.items = function(userId, field) {
				console.log(field);   
				// console.log("userId: " + userId)
				var thisID = "Unknown"; 
				for (var i =0; i < $scope.transactions.length; i++)
				{
					if ($scope.transactions[i]["_id"].valueOf() == userId)
					{
						if (typeof $scope.transactions[i]["items"] != 'undefined')
						{
							thisId = $scope.transactions[i]["items"][0][field]; 
						}
						else
						{
							return "Unknown";
						} 
					}
				}
				console.log(thisId); 
				if(thisId == "")
				{
					console.log("Unknown");
					return "Unknown";
				}
				else
				{
					return thisId;
				}
			 };
	
			$scope.formatDate = function(date){
      			return moment(date).format('MMM Do, YYYY h:mm:ss a'); 
    		}; 
		}
]);