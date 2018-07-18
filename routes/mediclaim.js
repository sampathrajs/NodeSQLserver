module.exports = function(express, db){
    var route = express.Router();
    var mediclaim = {};
    const sql = require('mssql');

    mediclaim.getfliter = function(req,res){
        var qq = `select * from Master_Branches;
                  select DepartmentId,DepartmentName,BranchID from Department`
        try{
          
            db.then(pool=>{
                return  pool.request()
                .query(qq)
            }).then(result=>{
                res.send({
                    "status":"success",
                    "branch":result.recordsets[0],
                    "department":result.recordsets[1]
                })
            }).catch(err=>{
                res.status(500).send({
                    "status":"error",
                    "branch":{},
                    "department":{}
                  })
            })         

        }catch(err){
            res.status(500).send({
              "status":"error",
              "branch":{},
              "department":{}
            })
        }
    }

    mediclaim.getusers = function (req, res) {

        var condition = [];
        /*var page = req.query.page,
            pageSize = req.query.resultperpage;
        */
        // Father and Mother Claims
        if (req.query.fatherclaim && req.query.motherclaim) {
            condition.push(`(U.FathersClaim = 1 or U.MothersClaim =1)`);
        } else {
            if (req.query.fatherclaim) {
                condition.push(`U.FathersClaim = 1`);
            }
            if (req.query.motherclaim) {
                condition.push(`U.MothersClaim = 1`);
            }
        }

        if (req.query.department) {
            condition.push(`U.DepartmentId = ${req.query.department}`);
        }

        var qq = `SELECT
                DISTINCT U.UserID,
                U.EmpID,
                ISNULL(U.FirstName,'') AS 'firstname',
                ISNULL(U.MiddleName,'') AS 'middlename',
                ISNULL(U.LastName,'') AS 'lastname',
                ISNULL(CONVERT(char(10), U.DateOfBirth,105),'') AS 'date_of_birth',
                MG.GenderName AS 'gender',
                ISNULL(U.ContactNo, '') AS 'contact_number',
                ISNULL(U.AlternateNumber, '') AS 'alternate_number',
                ISNULL(U.PersonalEmail, '') AS 'personal_email',
                MS.MaritalStatusType AS 'marital_status',
                DPT.DepartmentName AS 'department',
                MD.DesignationName AS 'designation',
                
                ISNULL(U.FathersClaim,0) AS 'father_claim',
                ISNULL(U.FatherName, '') AS 'father_firstName',
                ISNULL(U.FathersLastName,'') AS 'father_lastName',
                ISNULL(CONVERT(char(10), U.FatherDOB,105),'') AS 'father_DOB',
                ISNULL(U.MothersClaim,0) AS 'mother_claim',
                ISNULL( U.MotherName,'') AS 'mother_firstName',
                ISNULL(U.MothersLastName,'') AS 'mother_lastName',
                ISNULL(CONVERT(char(10), U.MotherDOB,105),'') AS 'mother_DOB',
                ISNULL(U.SpouseName, '') AS 'spouse_name',
                ISNULL(CONVERT(char(10), U.SpouseDOB,105),'') AS 'spouse_DOB'
                FROM Users U
                JOIN Department DPT ON U.DepartmentId = DPT.DepartmentId        
                JOIN Master_MaritalStatus MS ON U.MaritalStatus = MS.MaritalStatusID
                JOIN Master_Designation MD ON U.DesignationID = MD.DesignationID
                JOIN Master_Gender MG ON U.Gender = MG.GenderID WHERE ${condition.length > 0 ? condition.join(' AND ') : '1=1 '}`;


        try {
            new sql.Request().query(qq, (err, qqresult) => {
                if (!err) {
                    //var data = qqresult.recordset.slice(pageSize * (page - 1), pageSize * page);
                    res.send({
                        "status": "success",
                        "users": qqresult.recordset,
                    })
                } else {
                    console.log(err);
                    res.status(500).send({
                        "status": "error",
                        "data": {}
                    })
                }
            });
        } catch (err) {

            res.status(500).send({
                "status": "error",
                "data": {}
            })
        }
    }
    
    route.get('/filter',mediclaim.getfliter);  
    route.get('/users',mediclaim.getusers);   
    return route;
}