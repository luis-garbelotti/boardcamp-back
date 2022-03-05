import joi from 'joi';
import dayjs from 'dayjs';

const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().pattern(/^[0-9]{10,11}$/).min(10).max(11).required(),
    cpf: joi.string().pattern(/^[0-9]{11}$/).required(),
    birthday: joi.date()
})

export default customerSchema;