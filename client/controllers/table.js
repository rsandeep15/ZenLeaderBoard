angular.module("ZenLeaderBoard").controller("TableCtrl", ['$scope', '$meteor',
		function($scope, $meteor){
			$scope.fields = ["Account ID", "Transaction Code", "Base Currency", "Currency", "Amount", "Time Stamp"];
			$scope.category = "items.acctId";
			$scope.sort = {"items.acctId":1}; 
			$meteor.autorun($scope, function()
			{
				$meteor.subscribe("transactions", {sort: $scope.getReactively('sort')});
			}); 
			$scope.$watch('category', function(){
				if($scope.category)
				{
					var i = $scope.category;
				    var criteriaMap = {"Account ID":"items.acctId", "Transaction Code":"items.tranCode", "Base Currency":"baseCurrency", 
        			"Currency":"items.currency", "Amount":"items.amount", "Time Stamp":"timeStamp"};
        			var criteria = criteriaMap[i];  
        			switch(criteria) {
        				case "items.acctId":
        					$scope.sort = {"items.acctId" : 1};
        					break;
        				case "items.tranCode":
        					$scope.sort = {"items.tranCode" : 1};
        					break;
        				case "baseCurrency":
        					$scope.sort = {"baseCurrency" : 1};
        					break; 
        				case "items.currency":
        					$scope.sort = {"items.currency" : 1};
        					break;
        				case "items.amount":
        					$scope.sort = {"items.amount" : 1};
        					break;
        				case "timeStamp":
        					$scope.sort = {"timeStamp" : 1};
        					break;
        				default: 
        					$scope.sort = {"items.acctId" : 1};
        			}
					console.log($scope.sort);
				}
			});
			$scope.transactions = $meteor.collection(function(){
				return Transactions.find({}, {sort: $scope.getReactively('sort')}); 
			});
			$scope.remove = function(transaction){

				var thisTrans =   " Base Currency: " 
				 + transaction["baseCurrency"];
				if (typeof transaction["items"] != 'undefined')
				{
					thisTrans = "Account ID: " + transaction["items"][0]["acctId"] + " Transaction Code: " 
					+ transaction["items"][0]["tranCode"] + thisTrans +  " Currency: " 
					+ transaction["items"][0]["currency"] + " Amount: " + transaction["items"][0]["amount"]; 

				}  
				thisTrans = thisTrans + " Time Stamp: " + transaction["timeStamp"];
       			var deleted =  confirm("Confirm Delete: \n" + thisTrans);
				if (deleted)
				{
					$scope.transactions.splice($scope.transactions.indexOf(transaction), 1); 
				}
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
				//console.log(field);   
				// console.log("userId: " + userId)
				var thisID = "Unknown"; 
				for (var i =0; i < $scope.transactions.length; i++)
				{
					if ($scope.transactions[i]["_id"].valueOf() == userId)
					{
						if (typeof $scope.transactions[i]["items"] != 'undefined')
						{
							return $scope.transactions[i]["items"][0][field]; 
						}
						else
						{
							return "Unknown";
						} 
					}
				}
			 };
	
			$scope.formatDate = function(date){
      			return moment(date).format('MMM Do, YYYY h:mm:ss a'); 
    		}; 
		}
]);