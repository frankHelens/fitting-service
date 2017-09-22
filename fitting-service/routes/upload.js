var path = require("path");  
var moment = require("moment");
var express = require("express");  
var router = express.Router();
var multer = require('multer');  
var common = require('../utils/common')
// 数据库
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var dataSQL = require('../db/datasql');

var pool = mysql.createPool(dbConfig.mysql)

var storage = multer.diskStorage({
  destination: function (req, file, cb) {//文件存放地址  
    cb(null, path.join(__dirname,"/../uploads"));  
  },  
  filename: function (req, file, cb) { // 设置文件名
    cb(null, "("+moment().format("YYYY-MM-DD")+")"+file.originalname);  
  }  
});

var upload = multer({ storage: storage })  

router.post('/', upload.single('file'), function (req, res, next) {
  res.send(common.successFun(req.file, '成功'))
  // 上传成功后执行excel操作
});

router.put('/:file', function(req, res, next) {
  var fileList = common.getExcel(req.params.file)
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    fileList.forEach(function(item){
      connection.query(dataSQL.insert, [item.name, item.contact, item.updateTime, item.num], function(err, result) {
        if (result) {
          console.log('success')
        }
      })
    })
    res.send(common.successFun({}, '成功'))
  })
})

module.exports = router; 