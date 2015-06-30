angular.module("ZenLeaderBoard").controller("TableCtrl", ['$scope', '$meteor',
		function($scope, $meteor){
			$scope.fields = ["Account ID", "Transaction Code", "Base Currency", "Currency", "Amount", "Time Stamp"];
			$meteor.subscribe("transactions"); 
			$scope.transactions = $meteor.collection(Transactions1);
		}
]);