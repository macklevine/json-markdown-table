angular.module('inputController', [])
  .controller('inputController', function($scope){
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
  $scope.submitHeaders = function(){
    //invoke the function we have in the service with all of the bound variables.
  }
  $scope.addColumn = function removeColumn(){
    console.log("adding column...");
    //establish a max and min column count.
    for (var i = 0; i < $scope.inputRows.length; i++){
      $scope.inputRows[i].push({
        value: ""
      });
    }
  };
  $scope.removeColumn = function removeColumn(){
    //establish a max and min column count.
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
    //establish a max and min row count.
  };
  $scope.removeRow = function removeRow(){
    $scope.inputRows.pop();
    //extablish a max and min row count.
  };
});