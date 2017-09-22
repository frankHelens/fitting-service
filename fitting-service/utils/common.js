var xlsx = require("node-xlsx");

module.exports = {
  successFun: function (data, message) {
    return {
      code: 0,
      data: data,
      message: message
    }
  },
  getExcel: function (file) { // 获取表格数据
    var workSheetsFromFile = xlsx.parse('uploads/' + file);
    var dataList = workSheetsFromFile[0].data.filter(function (item, index) {
      return index > 0
    }).map(function (item, index) {
      return {
        name: item[7] || '',
        contact: item[8] || '',
        updateTime: item[14] ? new Date(1900, 0, item[14]) : '',
        num: item[15] || ''
      }
    })
    return dataList
  }
}