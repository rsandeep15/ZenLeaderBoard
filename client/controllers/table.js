angular.module("ZenLeaderBoard").controller("TableCtrl", ['$scope', '$meteor', '$rootScope',
		function($scope, $meteor, $rootScope){
			$scope.fields = ["Account ID", "Transaction Code", "Base Currency", "Currency", "Amount", "Time Stamp"];
			$scope.category = "Account ID";
			$scope.order = '1';
			$scope.strOrder = 'Ascending' 
			$scope.sort = {}; 
			$scope.page = 1;
			$scope.perPage = 10;  
			
			$scope.transactions = $meteor.collection(function(){
				return Transactions.find({}, {sort: $scope.getReactively('sort')});
			});

			$meteor.autorun($scope, function()
			{ 
				var searchString = $scope.getReactively('search');

				$meteor.subscribe("transactions", {sort: $scope.getReactively('sort')}, $scope.getReactively(
				'category'), $scope.getReactively('search') ); 
			}); 

			$scope.$watch('category', function(){
				if($scope.category)
				{
					// Generates a new way of sorting using a private utility method being passed the category and order field variables. See app.js 
        			$scope.sort = $scope.UTIL.createSort($scope.category, $scope.order); 
        		}
			});

			$scope.$watch('order', function(){
				if ($scope.order)
				{
					if ($scope.order == '1')
					{
						$scope.strOrder = 'Ascending';

					}
					else if ($scope.order == '-1')
					{
						$scope.strOrder = 'Descending';
					}
					$scope.sort = $scope.UTIL.createSort($scope.category, $scope.order); 
				}
			}); 

			$scope.remove = function(transaction){

				var thisTrans =   " Base Currency: " 
				 + transaction["baseCurrency"];
				if (typeof transaction["items"] != 'undefined')
				{
					thisTrans = "Account ID: " + transaction["items"][0]["acctId"] + " Transaction Code: " 
					+ transaction["items"][0]["tranCode"] + thisTrans +  " Currency: " 
					+ transaction["items"][0]["currency"] + " Amount: " + $scope.fixAmount(transaction["items"][0]["amount"]); 

				}  
				thisTrans = thisTrans + " Time Stamp: " + $scope.formatDate(transaction["timeStamp"]);
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

    		$scope.pageChanged = function(newPage){
    			console.log(newPage);
    			$scope.page = newPage; 
    		}; 

//     		$scope.getDistribution = function(){
//     			  var percentages = [];
//     			  var currencies = ["CAD", "USD", "HKD", "SGD" , "AUD", "GBP", "EUR", "YEN", "INR"];
//     			  var currencyMap = {"CAD": "Canadian Dollars", "USD":"US Dollars", "HKD":"Hong Kong Dollars", "SGD":"Singapore Dollars" 
// , "AUD":"Australian Dollars", "GBP":"British Pounds", "EUR": "Euros", "YEN":"Japanese Yen", "INR":"Indian Rupees"};
//     		      for (var i =0; i < currencies.length; i++)
//     		      {
//     		        var currency = currencies[i];
//     		        var totalTransactions = Transactions.find().count();
//     		        console.log(totalTransactions);
//     		        var currencyCount = Transactions.find({"items.currency":currency}).count(); 
//     		        var percentage = ((currencyCount/totalTransactions)* 100 ).toFixed(1) + "%";
//     		        percentages.push({'currency':currencyMap[currency], 'count': currencyCount, 'percentage': percentage});
//     		      }
//     		      return percentages; 
//     		};
		}
]);