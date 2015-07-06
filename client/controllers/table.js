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
				// $meteor.subscribe("transactions", {limit: parseInt($scope.getReactively('perPage')), 
				// 	skip: parseInt(($scope.getReactively('page') - 1) * $scope.getReactively('perPage')), 
				// 	sort: $scope.getReactively('sort')}).then(function(){
				// 	$scope.transactionsCount = $meteor.object(Counts, 'numberOfTransactions', false); 
				// $meteor.subscribe("transactions", {limit: parseInt($scope.getReactively('perPage')), 
				// 	skip: parseInt(($scope.getReactively('page') - 1) * $scope.getReactively('perPage')), 
				// 	sort: $scope.getReactively('sort')}); 
			var searchString = $scope.getReactively('search');
			// var field = $scope.getReactively('category'); 
			console.log(searchString);
			$meteor.subscribe("transactions", {sort: $scope.getReactively('sort')}, $scope.getReactively(
				'category'), $scope.getReactively('search') ); 
				// });
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
		}
]);