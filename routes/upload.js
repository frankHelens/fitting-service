var path = require("path");  
var moment = require("moment");
var express = require("express");  
var router = express.Router();
var multer = require('multer');  
var common = require('../utils/common')
var urllib = require('url');

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
  // excel文件转json数据
  var fileList = common.getExcel(req.file.filename)
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err)
      return err
    }
    // var num = 0; // 插入数量
    connection.query(dataSQL.batchInsert, [fileList], function(err, result) {
      if (result) {
        //删除名字重复的数据保留id最小的
        connection.query(dataSQL.deleteMin, [], function(err, minRes) {
          if (err) {
            console.log(err)
            return err
          }
          if (minRes) {
            // 删除单号重复的数据保留id最小的
            connection.query(dataSQL.deleteNum, [], function(err, deleteNumRes) {
              if (err) {
                console.log(err)
                return err
              }
              if (deleteNumRes) {
                // 删除单号重复的数据保留id最大的
                connection.query(dataSQL.deleteMax, [], function (err, maxRes) {
                  if (err) {
                    console.log(err)
                    return err
                  }
                  if (maxRes) {
                    res.send(common.successFun(fileList, '成功'))
                  }
                })
              }
            })
          }
        })
      } else {
        console.log(err)
        res.send(common.errorFun(err, '上传异常，请联系管理员！'))
      }
    })
    // var promise = new Promise(function(resolve, reject){ // es6 原生异步属性
    // });
    connection.release();
  })
});


module.exports = router; 