var express = require('express');
var router = express.Router();
// 增加url 依赖
var urllib = require('url');
var mysql = require('mysql');

// 初始数据
var data = {
    code: 0,
    data: {
      data: [],
      recordsFiltered: 0,
      recordsTotal: 0
    }
};

var dbConfig = require('../db/DBConfig');
var dataSQL = require('../db/datasql');

var pool = mysql.createPool(dbConfig.mysql)

// get请求
router.get('/', function (req, res, next) {
    // var orderBy = params.query.orderBy
  // 从连接池获取连接 
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    // 获取前台页面传过来的参数  
    var params = urllib.parse(req.url, true);
    var query = params.query;
    // 查询过滤
    var filterBy = query.filterBy
    // 设置分页
    var pageIndex = 0
    var pageSize = 0
    if (query.pageIndex && query.pageSize) {
      pageIndex = (Number(query.pageIndex)-1) * Number(query.pageSize);
      pageSize = Number(query.pageSize);
    } else {
      pageIndex = 0
      pageSize = 9999999
    }
    // 查询总数
    connection.query(dataSQL.getCount, function(err, result, fields) {
      data.data.recordsFiltered = result[0].count;
      data.data.recordsTotal = result[0].count;
    })
    // 建立连接 查询用户
    if (filterBy) { // 若有搜索(默认使用)
      // filterBy处理
      var filterStr = filterBy.split(';').map(function(item) {
        return item.split('|')[0] + ' = "' + item.split('|')[2] + '"'
      }).join(' OR ')
      // 查询
      connection.query(dataSQL.queryAll+ ' WHERE ' + filterStr, [], function(err, rows, fields) {
        if (err) throw err;
        data.data.data = rows
        // 输出data的内容
        res.end(JSON.stringify(data));
        // 释放连接  
        connection.release();
      })
    } else {
      connection.query(dataSQL.queryLimit, [pageIndex, pageSize], function(err, rows, fields) {
       if (err) throw err;
        data.data.data = rows
        // 输出data的内容
        res.end(JSON.stringify(data));
        // 释放连接  
        connection.release();
      })
    }
  })
});

module.exports = router;
