

class EmployeeController {


    static async getEmployee(req, res, next) {
        res.render('index.ejs')
    }


}


module.exports = EmployeeController