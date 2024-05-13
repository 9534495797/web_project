const  obj = { name: "ankit",age:21,education:"B.tech" };
var  jsonString = JSON.stringify(obj);
console.log(jsonString); // Outputs: {"name":"myObj"}


var jsonString = '{"name":"Ankit","age":21,"education":"b.tech"}';
var parsedObj = JSON.parse(jsonString);
console.log(parsedObj); // Outputs: myOb