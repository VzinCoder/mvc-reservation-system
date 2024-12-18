const addRoomTypeChange = (typeInput,bedInput) => {
    const roomTypeElement = typeInput
    const bedsElement = bedInput

    const handleToggleTypesRoom = ({ target }) => {
        const ROOM_TYPES = {
            SINGLE: 1,
            DOUBLE: 2,
            FAMILY: 3,
        }
    
        const type = target.value
        const value = ROOM_TYPES[type]
    
        if (!value) {
            beds.value = ""
            bedsElement.disabled = true
            return
        }
    
        const setInputState = (input, { disabled, value, min }) => {
            input.disabled = disabled
            input.value = value
            if (min !== undefined) {
                input.min = min
            }
        }
    
        if (value !== ROOM_TYPES.FAMILY) {
            setInputState(bedsElement, { disabled: false, value })
            return
        }
        setInputState(bedsElement, { disabled: false, value, min: value })
    
    }
    roomTypeElement.addEventListener('change', handleToggleTypesRoom)
}


