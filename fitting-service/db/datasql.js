var DataSQL = {  
  // insert:'INSERT INTO data(uid,userName) VALUES(?,?)', 
  insert: 'INSERT INTO data (name,contact,updateTime,num) VALUES (?,?,?,?)',
  queryLimit:'SELECT * FROM data LIMIT ?,?',
  queryAll:'SELECT * FROM data',
  getUserById:'SELECT * FROM data WHERE uid = ?',
  getCount: 'SELECT count(*) count FROM data',
  queryLike: "SELECT * FROM data WHERE ?"
}

module.exports = DataSQL;