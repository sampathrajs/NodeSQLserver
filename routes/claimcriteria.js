module.exports = function (express, db) {
    var route = express.Router();
    var claimcriteria = {};
    const sql = require('mssql');
    var finalresult = [];

    claimcriteria.gettilesclaimdetails = function (req, res) {
        var qq1 = `select count(*) as fathersclaim from Users where FathersClaim =1 and Personaldetails is not null and Personaldetails <> 0`;
        var qq2 = `select count(*) as mothersclaim from Users where MothersClaim =1 and Personaldetails is not null and Personaldetails <> 0`;
        var qq3 = `select count(*) as married from Users where MaritalStatus=1`;
        var qq4 = `select count(*) as childrenenrolled from Childrens_Information where isactive=1`;

        try {
            new sql.Request().query(qq1, (err, result_qq1) => {
                if (!err) {
                    new sql.Request().query(qq2, (err, result_qq2) => {
                        if (!err) {
                            new sql.Request().query(qq3, (err, result_qq3) => {
                                if (!err) {
                                    new sql.Request().query(qq4, (err, result_qq4) => {
                                        if (!err) {
                                            res.send({
                                                "status": "success",
                                                "result": {
                                                    fatherclaim: result_qq1.recordset[0].fathersclaim,
                                                    motherclaim: result_qq2.recordset[0].mothersclaim,
                                                    married: result_qq3.recordset[0].married,
                                                    childrensenrolled: result_qq4.recordset[0].childrenenrolled
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })

                }
            })
        } catch (err) {
            res.status(500).send({
                "status": "error"
            })
        }
    }

    claimcriteria.getpieclaimdetails = function (req, res) {
        var qq1 = `select count(*) as notenrolled from Users where Personaldetails is null or Personaldetails=0`;
        var qq2 = `select count(*) as claimed from Users where MothersClaim =1 or FathersClaim =1 and Personaldetails is not null and Personaldetails <> 0`;
        var qq3 = `select count(*) as notclaimed from Users where MothersClaim <> 1 or FathersClaim <> 1 and Personaldetails is null and Personaldetails =0`;

        try {
            new sql.Request().query(qq1, (err, result_qq1) => {
                if (!err) {
                    new sql.Request().query(qq2, (err, result_qq2) => {
                        if (!err) {
                            new sql.Request().query(qq3, (err, result_qq3) => {
                                if (!err) {
                                    console.log(result_qq1.recordset[0])
                                    res.send({
                                        "status": "success",
                                        "result": {
                                            notenrolled: result_qq1.recordset[0].notenrolled,
                                            claimed: result_qq2.recordset[0].claimed,
                                            notclaimed: result_qq3.recordset[0].notclaimed
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        } catch (err) {
            res.status(500).send({
                "status": "error"
            })
        }
    }

    route.get('/tilesclaimdetail', claimcriteria.gettilesclaimdetails);
    route.get('/pieclaimdetails', claimcriteria.getpieclaimdetails);

    return route;
}