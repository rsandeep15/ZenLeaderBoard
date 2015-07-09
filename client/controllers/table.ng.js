angular.module('ZenLeaderBoard').controller('TableCtrl', ['$scope', '$meteor', '$filter',
		function($scope, $meteor, $filter){
			$scope.fields = ["Account ID", "Transaction Code", "Base Currency", "Currency", "Amount", "Time Stamp"];
			$scope.category = "Account ID";
			$scope.order = '1';
			$scope.strOrder = 'Ascending' 
			$scope.sort = {}; 
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
				thisTrans = thisTrans + " Time Stamp: " + $filter('date')(transaction["timeStamp"], 'medium');
       			var deleted =  confirm("Confirm Delete: \n" + thisTrans);
				if (deleted)
				{
					$scope.transactions.splice($scope.transactions.indexOf(transaction), 1); 
				}
			};

			$scope.fixAmount = function(amount){
				return $scope.UTIL.fixAmount(amount); 
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
		}
]);