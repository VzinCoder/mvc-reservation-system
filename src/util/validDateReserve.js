const { parseISO, isBefore, isEqual, startOfDay } = require('date-fns')


const validDateReserve = ({checkin, checkout}) => {
    const currentDate = startOfDay(new Date())
    const parsedCheckinDate = startOfDay(parseISO(checkin))
    const parsedCheckoutDate = startOfDay(parseISO(checkout))

    if (isBefore(parsedCheckinDate, currentDate)) {
        throw new Error('Check-in date cannot be in the past.')
    }

    if (
        !isBefore(parsedCheckinDate, parsedCheckoutDate)
        || isEqual(parsedCheckinDate, parsedCheckoutDate)
    ) {
        throw new Error('Check-out date must be after check-in date.')
    }

    return true
}

module.exports = {
    validDateReserve
}