const customerNameElement = document.getElementById('name')
const customerPhoneElement = document.getElementById('phone')
const customerEmail = document.getElementById('email')
const searchCustomerElement = document.getElementById('search-customer')
const roomTypeElement = document.getElementById('room-type')
const bedsElement = document.getElementById('beds')
const checkinDateElement = document.getElementById('checkin-date')
const checkoutDateElement = document.getElementById('checkout-date')
const inputCustomerId = document.getElementById('customer_id')
const form = document.querySelector('form')
const selectAvailableRooms = document.getElementById('available-rooms')

const fetchCostumer = async (cpf) => {
    const response = await fetch(`/customer/json/${cpf}`)
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.error)
    }
    return data
}

const showCustomer = (customer) => {
    customerNameElement.value = customer.name || '';
    customerPhoneElement.value = customer.phone || '';
    customerEmail.value = customer.email || '';
}

const handleSearchCustomerClick = async () => {
    let swalInstance = null

    const delay = () =>
        new Promise((resolve) => setTimeout(resolve, 500))

    try {
        const cpf = document.getElementById('cpf').value;

        if (!cpf) {
            Swal.fire({
                icon: 'warning',
                title: 'Please enter a valid CPF.',
            })
            return
        }

        swalInstance = Swal.fire({
            title: "Searching Customer...",
            text: "Please wait while we fetch the customer data.",
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        })

        const promiseDelay = delay()
        const cpfFormatted = cpf.replace(/\D/g, '')
        const customer = await fetchCostumer(cpfFormatted)
        await promiseDelay
        swalInstance.close()
        inputCustomerId.value = customer.id
        showCustomer(customer)
    } catch (error) {
        if (swalInstance) {
            swalInstance.close()
        }
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
        })
    }
}

const createHandleFilterChange = () => {
    let debounceTimeout
    return () => {
        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(() => {
            filterRooms()
        }, 500)
    }
}

const handleFilterChange = createHandleFilterChange()

async function filterRooms() {
    const roomType = roomTypeElement.value
    const beds = bedsElement.value
    const checkinDate = checkinDateElement.value
    const checkoutDate = checkoutDateElement.value


    if (!checkinDate || !checkoutDate) {
        return
    }

    let url = `/room/json/available/?checkin=${checkinDate}&checkout=${checkoutDate}`
    if (roomType) {
        url += `&type=${roomType}`
    }
    if (beds) {
        url += `&beds=${beds}`
    }

    try {
        const response = await fetch(url)
        const rooms = await response.json()

        const roomSelect = document.getElementById('available-rooms')
        roomSelect.innerHTML = '<option value="">Select a Room</option>'

        if (!response.ok || rooms.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'No rooms available for the selected dates.'
            roomSelect.appendChild(option)
        } else {
            rooms.forEach(({ id, room_code, room_number, floor }) => {
                const option = document.createElement('option')
                option.value = id
                option.textContent = `Room ${room_code} | Number ${room_number} | Floor ${floor}`
                roomSelect.appendChild(option)
            })
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
        })
    }
}

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
        setInputState(bedsElement, { disabled: true, value })
        return
    }
    setInputState(bedsElement, { disabled: false, value, min: value })

}

const handleSubmit = (event) => {
    const inputCustomerId = document.getElementById('customer_id');
    if (!inputCustomerId.value) {
        event.preventDefault();
        Swal.fire({
            icon: 'warning',
            title: 'Customer Required',
            text: 'Please search a customer before submitting the form.',
        })
    }

    const msgRoomsNotAvailable =  "No rooms available for the selected dates."
    const isInvalidValue = selectAvailableRooms.value === msgRoomsNotAvailable

    if (!selectAvailableRooms.value || isInvalidValue) {
        event.preventDefault()
        Swal.fire({
            icon: 'warning',
            title: 'Room Required',
            text: 'Please select a valid room before submitting the form.',
        })
        return
    }
}



form.addEventListener('submit', handleSubmit)
searchCustomerElement.addEventListener('click', handleSearchCustomerClick)
roomTypeElement.addEventListener('change', handleFilterChange)
roomTypeElement.addEventListener('change', handleToggleTypesRoom)
bedsElement.addEventListener('input', handleFilterChange)
checkinDateElement.addEventListener('input', handleFilterChange)
checkoutDateElement.addEventListener('input', handleFilterChange)