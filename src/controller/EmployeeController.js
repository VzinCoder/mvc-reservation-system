

class EmployeeController {


    static async getEmployee(req, res, next) {
        res.render('employee/list.ejs')
    }


}


module.exports = EmployeeController