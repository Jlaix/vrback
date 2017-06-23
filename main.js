// 接口监听 & 数据处理
var express = require('express'),
	app = express(),
    http = require('http').Server(app),
    url = require('url'),
    util = require('util'),
    querystring = require('querystring'),
    formidable = require('formidable'),
    path = require('path'),
    fs = require("fs"),
	fileTools = require("./fileTools");

var kHost = "http://127.0.0.1:8080/";
var kShopVrImgPath = "data/shopvrimg/";
var kDishVrVideoPath = "data/dishvrvideo/";

app.use(express.static('./'));

// 商家全景图的拍摄上传接口
app.post('/vr/shop/uploadimg', function (request, response) {
    var form = new formidable.IncomingForm();

    // Path 暂时不根据 shopId 做区分了
    fileTools.createPathIfNeeded(path.join(__dirname, kShopVrImgPath));
    form.uploadDir = kShopVrImgPath;

    form.encoding = 'utf-8';
    //保留后缀
    form.keepExtensions = true;
    //设置单文件大小限制: 5M    
    form.maxFieldsSize = 10 * 1024 * 1024;

    form.parse(request, function(err, fields, files) {
	    if (err) {
	    	var result = {
		       code:404,
		       message:'vr img upload failed, maybe it is too big',
		    };
		    return response.status(404).send(JSON.stringify(result));
        }

	    var shopId = fields.shopId;
	    var userId = fields.userId;
	    var title = fields.title;
	    var description = fields.description;
	    var source = fields.source;
	    // 客户端上传参数解析，必传参数不满足返回 err
	    if (!shopId) {
	    	var result = {
		       code:400,
		       message:'necessary params not found',
		    };
		    return response.status(400).send(JSON.stringify(result));
	    }
        // 写入信息
        fileTools.loadJsonFromFile(kShopVrImgPath, shopId + '.vr', function (jsonData) {
        	var imgInfo = jsonData ? jsonData : {};
        	console.log(util.inspect(files)); 
        	imgInfo[files['fileData']['path']] = {
        		title:title,
        		description:description,
        		source:source,
        	}

        	fileTools.saveJsonToFile(kShopVrImgPath, shopId + '.vr', imgInfo);
        	var result = {
		       code:200,
		       message:'success',
		    };
		    return response.status(200).send(JSON.stringify(result));
        });
    });	
});

// 商家全景图数据下载接口
app.get('/vr/shop/shopvrimgs', function (request, response) {
    // 客户端上传参数解析，必传参数不满足返回 err
    var params = url.parse(request.url, true).query; 
    var shopId = params.shopId;
	if (!shopId) {
	    return response.status(404).send('necessary params not found');
    }

    fileTools.loadJsonFromFile(kShopVrImgPath, shopId + '.vr', function (jsonData) {
    	console.log('jsonData '+jsonData);
    	console.log('kShopVrImgPath '+kShopVrImgPath+shopId + '.vr');
    	if(!jsonData) {
    		var result = {
		       code:404,
		       message:'resource not found',
		    };
		    return response.status(404).send(JSON.stringify(result));
    	}
    	var shopvrimgs = [];
    	for (var pathKey in jsonData) {
            var imgInfo = {
            	title:jsonData[pathKey]['title'],
            	description:jsonData[pathKey]['description'],
            	img:kHost + pathKey,
            	source:jsonData[pathKey]['source'],
            }
            shopvrimgs.push(imgInfo);
	    }
    	var result = {
    		shopvrimgs:shopvrimgs,
    	}
	    return response.status(200).send(JSON.stringify(result));
    });
});


// 菜品全景图的拍摄上传接口
app.post('/vr/dish/uploadvideo', function (request, response) {
    var form = new formidable.IncomingForm();

    // Path 暂时不根据 shopId 做区分了
    fileTools.createPathIfNeeded(path.join(__dirname, kDishVrVideoPath));
    form.uploadDir = kDishVrVideoPath;

    form.encoding = 'utf-8';
    //保留后缀
    form.keepExtensions = true;
    //设置单文件大小限制: 20M    
    form.maxFieldsSize = 20 * 1024 * 1024;

    form.parse(request, function(err, fields, files) {
	    if (err) {
	    	var result = {
		       code:404,
		       message:'vr video upload failed, maybe it is too big',
		    };
		    return response.status(404).send(JSON.stringify(result));
        }

	    var shopId = fields.shopId;
	    var userId = fields.userId;
	    var title = fields.title;
	    var description = fields.description;
	    // 客户端上传参数解析，必传参数不满足返回 err
	    if (!shopId) {
	    	var result = {
		       code:400,
		       message:'necessary params not found',
		    };
		    return response.status(400).send(JSON.stringify(result));
	    }
        // 写入信息
        fileTools.loadJsonFromFile(kDishVrVideoPath, shopId + '.vr', function (jsonData) {
        	var imgInfo = jsonData ? jsonData : {};
        	imgInfo[files['fileData']['path']] = {
        		title:title,
        		description:description,
        		source:source,
        	}

        	fileTools.saveJsonToFile(kDishVrVideoPath, shopId + '.vr', imgInfo);
        	var result = {
		       code:200,
		       message:'success',
		    };
		    return response.status(200).send(JSON.stringify(result));
        });
    });	
});

// 商家全景图数据下载接口
app.get('/vr/dish/dishvrvideos', function (request, response) {
    // 客户端上传参数解析，必传参数不满足返回 err
    var params = url.parse(request.url, true).query; 
    var shopId = params.shopId;
	if (!shopId) {
	    return response.status(404).send('necessary params not found');
    }

    fileTools.loadJsonFromFile(kDishVrVideoPath, shopId + '.vr', function (jsonData) {
    	console.log('jsonData '+jsonData);
    	console.log('kDishVrVideoPath '+kDishVrVideoPath+shopId + '.vr');
    	if(!jsonData) {
    		var result = {
		       code:404,
		       message:'resource not found',
		    };
		    return response.status(404).send(JSON.stringify(result));
    	}
    	var dishvrvideos = [];
    	for (var pathKey in jsonData) {
            var videoInfo = {
            	title:jsonData[pathKey]['title'],
            	description:jsonData[pathKey]['description'],
            	video:kHost + pathKey,
            	source:jsonData[pathKey]['source'],
            }
            dishvrvideos.push(videoInfo);
	    }
    	var result = {
    		dishvrvideos:dishvrvideos,
    	}
	    return response.status(200).send(JSON.stringify(result));
    });
});

app.get('/test', function (request, response) {
    response.writeHead(200, {'content-type': 'text/html'});
    response.end(
    '<form action="/vr/dish/uploadvideo" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="text" name="description"><br>'+
    '<input type="text" name="shopId"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
    );
    return;
});

app.use(function(req, res, next) {
    console.error('ERROR: request wrong path');
    res.status(404).send({'error' : 'resources not found'});
}); // 兜底处理：返回错误码

http.listen(8080, function() {
    console.log('listening on *:8080');
});
