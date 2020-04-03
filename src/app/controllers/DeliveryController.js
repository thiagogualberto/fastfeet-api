import * as Yup from 'yup';
import { parseISO, getHours, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
// import Recipient from '../models/Recipients';
// import DeliveryMan from '../models/Deliveryman';
import Order from '../models/Order';

class DeliveryController {
    async index(req, res) {
        const { id } = req.params;
        const { page } = req.query;

        const orderAll = await Order.findAll({
            where: {
                deliveryman_id: id,
                end_date: null,
                canceled_at: null,
            },
            attributes: [
                'id',
                'product',
                'start_date',
                'end_date',
                'signature_id',
            ],
            order: ['created_at'],
            limit: 5,
            offset: (page - 1) * 5,
            include: [
                {
                    model: Recipient,
                    as: 'recipient',
                    attributes: [
                        'id',
                        'name',
                        'address',
                        'number',
                        'city',
                        'state',
                        'postalcode',
                    ],
                },
            ],
        });

        return res.json(orderAll);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            start_date: Yup.date(),
            end_date: Yup.date(),
            signature_id: Yup.number(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails..' });
        }

        const { id } = req.params;

        const orderExist = await Order.findByPk(id);
        if (!orderExist) {
            return res.status(400).json({ error: 'Order is not exist.' });
        }

        const { deliveryman_id } = orderExist;

        const { start_date, end_date, signature_id } = req.body;

        if (start_date) {
            const parsedStartDate = parseISO(start_date);
            const hourStart = getHours(parsedStartDate);
            if (hourStart < 8 || hourStart > 18) {
                return res
                    .status(400)
                    .json({ error: 'Time must between 8:00 and 18:00.' });
            }

            const ordersDeliveryman = await Order.findAll({
                where: {
                    deliveryman_id,
                    start_date: {
                        [Op.between]: [
                            startOfDay(parsedStartDate),
                            endOfDay(parsedStartDate),
                        ],
                    },
                },
            });

            if (ordersDeliveryman.length > 5) {
                return res
                    .status(400)
                    .json({ error: 'You reached the day limit.' });
            }

            // await orderExist.update({ start_date });
            return res.json();
        }
        if (end_date && signature_id) {
            // await orderExist.update({ end_date, signature_id });
            return res.json({ delivered: true });
        }

        return res.json();
    }
}

export default new DeliveryController();
