import * as Yup from 'yup';
import Recipient from '../models/Recipients';
import DeliveryMan from '../models/Deliveryman';
import Order from '../models/Order';

import NewDeliverMail from '../jobs/NewDeliverMail';
import Queue from '../../lib/Queue';

class OrderController {
    async index(req, res) {
        const { page } = req.query;

        const orderAll = await Order.findAll({
            where: { canceled_at: null },
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
                {
                    model: DeliveryMan,
                    as: 'deliveryman',
                    attributes: ['id', 'name'],
                },
            ],
        });

        return res.json(orderAll);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            recipient_id: Yup.number().required(),
            deliveryman_id: Yup.number().required(),
            product: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails..' });
        }

        const { recipient_id, deliveryman_id } = req.body;

        const recipientExist = await Recipient.findByPk(recipient_id);
        if (!recipientExist) {
            return res.status(400).json({ error: 'Recipient is not exist.' });
        }

        const deliverymanExist = await DeliveryMan.findByPk(deliveryman_id);
        if (!deliverymanExist) {
            return res.status(400).json({ error: 'Deliveryman is not exist.' });
        }

        const order = await Order.create(req.body);

        await Queue.add(NewDeliverMail.key, {
            deliverymanExist,
            product: req.body.product,
            recipientExist,
        });

        return res.json(order);
        // return res.json({ ok: 'CADASTROU' });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            id: Yup.string().required(),
            recipient_id: Yup.number(),
            deliveryman_id: Yup.number(),
            product: Yup.string(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails..' });
        }

        const orderExist = await Order.findByPk(req.body.id);
        if (!orderExist) {
            return res.status(400).json({ error: 'Order is not exist.' });
        }

        const orderUpdate = await orderExist.update(req.body);

        return res.json(orderUpdate);
    }

    async delete(req, res) {
        const orderExist = await Order.findByPk(req.params.id);
        if (!orderExist) {
            return res.status(400).json({ error: 'Order is not exist.' });
        }

        await orderExist.destroy();

        // Tratamento para somente atualizar a data de cancelamento
        // orderExist.canceled_at = new Date();
        // await orderExist.save();

        // Pegar todos os dados do registro que foi inserido na tabela ORDER
        // Enviar e-mail para o entregador informando sobre a encomenda.

        // return res.json(order);
        return res.status(204).send();
    }
}

export default new OrderController();
