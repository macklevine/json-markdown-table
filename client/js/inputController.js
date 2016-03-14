angular.module('input.inputController', [])
  .controller('inputController', function ($scope, InputService){
  $scope.inputRows = [
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
  $scope.submitHeaders = function submitHeaders(){
    //do we need to accept an argument fro outside of the function?
    console.log($scope.inputRows);
    InputService.sendInputData($scope.inputRows)
      .then(function(tableString){
        //populate the textArea with the string we get back from the service.
      });
    //invoke the function we have in the service with all of the bound variables.
  }
  $scope.addColumn = function removeColumn(){
    //TODO: establish a max and min column count.
    for (var i = 0; i < $scope.inputRows.length; i++){
      $scope.inputRows[i].push({
        value: ""
      });
    }
  };
  $scope.removeColumn = function removeColumn(){
    //TODO: establish a max and min column count.
    for(var i = 0; i < $scope.inputRows.length; i++){
      $scope.inputRows[i].pop();
    }
  }
  $scope.addRow = function addRow(){
    var rowToAdd = [];
    for(var i = 0; i < $scope.inputRows[0].length; i++){
      rowToAdd.push({
        value: ""
      });
    }
    $scope.inputRows.push(rowToAdd);
    //TODO: establish a max and min row count.
  };
  $scope.removeRow = function removeRow(){
    $scope.inputRows.pop();
    //TODO: extablish a max and min row count.
  };
});