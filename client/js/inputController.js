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
  $scope.textAreaVal = "table will show up here...";
  //initialize columns here.
  $scope.submitCells = function submitCells(){
    InputService.sendInputData($scope.inputRows)
      .then(function(response){
        if (response && response.data.tableString){
          var tableString = response.data.tableString;
          $scope.textAreaVal = tableString;
        } else {
          $scope.textAreaVal = response.data;
          //TODO: add a css class to textAreaVal making the input text red.
        }
      });
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