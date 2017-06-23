var fs = require("fs");
var fileTools = require("./fileTools");

module.exports.createPathIfNeeded = function(path) {
	fs.exists(path, function(exists) { 
		if (!exists) {
			fs.mkdir(path,function(err){
			   if (err) {
			       return console.error(err);
			   }
			}); 
		} 
	}); 
};

module.exports.saveJsonToFile = function(path, fileName, jsonData) {
	fileTools.createPathIfNeeded(path);
	fs.writeFile(path + fileName, JSON.stringify(jsonData), function(err) {
	    if(err) {
	        console.log(err);
	        return false;
	    }
	    return true;
	});
};

module.exports.loadJsonFromFile = function(path, fileName, loadCallBack) {
	fs.exists(path + fileName, function(exists) { 
		if (!exists) {
	        return loadCallBack(null);
		} 

		var data = fs.readFileSync(path + fileName,"utf-8"); 
	    return loadCallBack(JSON.parse(data)); 
	});
};




