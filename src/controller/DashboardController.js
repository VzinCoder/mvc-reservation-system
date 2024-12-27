const CustomerModel = require("../model/CustomerModel");
const EmployeeModel = require("../model/EmployeeModel")
const ReserveModel = require("../model/ReserveModel")
const logger = require("../util/logger")
const { isSameMonth, getMonth } = require('date-fns')

class DashboardController {

    static NUMBER_TO_MONTH = {
        0: 'JAN',
        1: 'FEB',
        2: 'MAR',
        3: 'APR',
        4: 'MAY',
        5: 'JUN',
        6: 'JUL',
        7: 'AUG',
        8: 'SEP',
        9: 'OCT',
        10: 'NOV',
        11: 'DEC'
    }


    static async getPageHome(req, res, next) {
        try {
            logger.info("Rendering home dashboard");
            const [employees, reservesYear, customers] = await Promise.all([
                EmployeeModel.findAll(),
                ReserveModel.findAllReservesYear(),
                CustomerModel.findAll()
            ])
            const qtyEmployees = employees.length;
            const qtyCustomers = customers.length;

            const initalMap = { DOUBLE: 0, FAMILY: 0, SINGLE: 0 }
            const roomTypeDistribution = reservesYear.reduce((acc, { room_type }) =>
                ({ ...acc, [room_type]: (acc[room_type] || 0) + 1 }), initalMap)

            const monthEarnings = reservesYear.reduce((acc, { created_at, total_price }) => {
                const month = this.NUMBER_TO_MONTH[getMonth(created_at)] 
                return {...acc,[month]: (acc[month] || 0) + Number(total_price) }
            }, {})

            const reservesMonth = reservesYear.filter(({ created_at }) => {
                return isSameMonth(created_at, new Date())
            })

            const calculateTotal = (reserves) =>
                reserves.reduce((acc, { total_price }) => acc + Number(total_price), 0)

            const earningMonth = calculateTotal(reservesMonth).toFixed(2)
            const earningYear = calculateTotal(reservesYear).toFixed(2)

            res.render('index', {
                qtyEmployees,
                qtyCustomers,
                earningMonth,
                earningYear,
                roomTypeDistribution,
                monthEarnings
            })
        } catch (err) {
            logger.error("Error rendering home dashboard", err)
            next(err)
        }
    }

}


module.exports = DashboardController