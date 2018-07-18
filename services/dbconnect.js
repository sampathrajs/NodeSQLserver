module.exports = (config)=>{
    const sql = require('mssql');
    sql.on('error', err => {
        console.log(err);
    });
    var sqlConfig= {
        user: config.db.user,
        password: config.db.password,
        server: config.db.server,
        port:config.db.port,
        database:config.db.name
    }
    return sql.connect(sqlConfig); 
}