angular.module('ZenLeaderBoard').controller('TableCtrl', ['$scope', '$meteor', '$filter',
		function($scope, $meteor, $filter){
			$scope.fields = ["Account ID", "Transaction Code", "Base Currency", "Currency", "Amount", "Time Stamp"];
			$scope.category = "Account ID";
			$scope.order = '1';
			$scope.strOrder = 'Ascending' 
			$scope.sort = {};
			$scope.perPage = 100;  
			$scope.page = 1; 
			$scope.transactions = $meteor.collection(function(){
				return Transactions.find({}, {sort: $scope.getReactively('sort')});
			});

			$meteor.autorun($scope, function()
			{ 
				// 100 transactions per page, skip to correct page on click, subscribe to relevant Transactions 
				$meteor.subscribe("transactions", {limit: parseInt($scope.getReactively('perPage')), 
					skip: parseInt(($scope.getReactively('page') - 1) * $scope.getReactively('perPage')), 
					sort: $scope.getReactively('sort')}, 
					$scope.getReactively('category'), 
					$scope.getReactively('search') ).then(function(){
					$scope.transactionCount = $meteor.object(Counts, 'numberOfTransactions', false); 
				}); 
				console.log("subscribe called");
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
					thisTrans = "Account ID: " + transaction["acctId"] + " Transaction Code: " 
					+ transaction["tranCode"] + thisTrans +  " Currency: " 
					+ transaction["currency"] + " Amount: " + $scope.fixAmount(transaction["amount"]); 
				thisTrans = thisTrans + " Time Stamp: " + $filter('date')(transaction["timeStamp"], 'medium');
       			var deleted =  confirm("Confirm Delete: \n" + thisTrans);
				if (deleted)
				{
					$scope.transactions.splice($scope.transactions.indexOf(transaction), 1); 
				}
			};
			$scope.removeAll = function(){
				var ok = confirm("Are you sure you want to remove all transactions?");
				if (ok == true)
				{
					Meteor.call("removeAll");
				}
			};
			$scope.fixAmount = function(amount){
				return $scope.UTIL.fixAmount(amount); 
			};
			$scope.pageChanged = function(newPage){
				$scope.page = newPage; 
			};
		}
]);