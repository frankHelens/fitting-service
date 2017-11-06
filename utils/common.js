var xlsx = require("node-xlsx");
var moment = require("moment");

module.exports = {
  successFun: function (data, message) {
    return {
      code: 0,
      data: data,
      message: message
    }
  },
  errorFun: function (data, message) {
    return {
      code: -1,
      data: data,
      message: message
    }
  },
  getExcel: function (file) { // 获取表格数据
    var workSheetsFromFile = xlsx.parse('uploads/' + file);
    var dataList = workSheetsFromFile[0].data.filter(function (item, index) {
      return item.length
    }).filter(function (item, index) {
      return index > 0
    }).map(function (item, index) {
      var name = item[7] || ''
      var contact = item[8] || ''
      var updateTime = item[14] ? moment(new Date(1900, 0, item[14]-1)).format('YYYY-MM-DD') : ''
      var num = item[15] || ''
      return [name, contact, updateTime, num]
    })
    return dataList
  }
}