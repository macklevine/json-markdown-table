angular.module('inputController', [])
  .controller('inputController', function($scope){
  var columnHeight = 2;
  $scope.inputColumns = [
    [
      {value:'header1'}, 
      {value:'header2'}
    ],
    [
      {value:'value1'},
      {value:'value2'}
    ]
  ];
  //initialize columns here.
  $scope.submitHeaders = function(){
  }
  $scope.addColumns = function(){
    console.log("adding column...");
    columns.push
  };
  $scope.addRow = function(){
    columnHeight++;
  };
  $scope.removeRow = function(){
    columnHeight--;
  };
});