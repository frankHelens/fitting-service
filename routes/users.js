var express = require('express');
var router = express.Router();
var common = require('../utils/common')
var moment = require("moment");

// 数据库
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var dataSQL = require('../db/datasql');

var pool = mysql.createPool(dbConfig.mysql);

// 校验
router.post('/', function (req, res) {
  var pwd = req.body.uploadPwd;
  console.log(pwd)
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err)
      return err
    }
    connection.query(dataSQL.checkPwd, [pwd], function(err, rows, fields) {
      if (err) {
        console.log(err)
      }
      if (rows.length) {
        res.send(common.successFun({
          timestamp: moment().format('x')
        }, '成功'))
      } else {
        res.send(common.errorFun({}, '密码不正确,请重新输入！'))
      }
      // 释放连接  
      connection.release();
    })
  })
});

module.exports = router;
