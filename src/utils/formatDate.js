import dayjs from "dayjs";

export default function formatDate(array) {
    
    const formatedCostumers = array.map(customer => { 
        return {
            ...customer,
            birthday: dayjs(customer.birthday).format('YYYY-MM-DD')
        }
        })

    return formatedCostumers;

}