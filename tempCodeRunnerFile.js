// const  obj = { name: 'myObj' };
// var  jsonString = JSON.stringify(obj);
// console.log(jsonString); // Outputs: {"name":"myObj"}


var jsonString = '{"name":"myObj"}';
var parsedObj = JSON.parse(jsonString);
console.log(parsedObj.name); // Outputs: myObj
