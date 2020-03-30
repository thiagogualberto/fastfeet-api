import * as Yup from 'yup';
import Recipient from '../models/Recipients';
import DeliveryMan from '../models/Deliveryman';
import Order from '../models/Order';

class OrderController {
    async index(req, res) {
        // Falta tratamento para paginação
        // Acrescentar mais informações a serem buscadas
        const orderAll = await Order.findAll({
            where: { canceled_at: null },
            attributes: [
                'id',
                'recipient_id',
                'deliveryman_id',
                'signature_id',
                'product',
                'start_date',
                'end_date',
            ],
            order: ['created_at'],
            limit: 5,
            // offset: (page - 1) * 5,
            include: [
                {
                    model: Recipient,
                    as: 'recipient',
                    attributes: [
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
                    attributes: ['name'],
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

        // Pegar todos os dados do registro que foi inserido na tabela ORDER
        // Enviar e-mail para o entregador informando sobre a encomenda.

        return res.json(order);
    }

    // async update(req, res) {return res.json();}

    async delete(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails..' });
        }

        const orderExist = await Recipient.destroy(req.body.id);
        if (!orderExist) {
            return res.status(400).json({ error: 'Order is not exist.' });
        }

        orderExist.canceled_at = new Date();

        await orderExist.save();

        // Pegar todos os dados do registro que foi inserido na tabela ORDER
        // Enviar e-mail para o entregador informando sobre a encomenda.

        // return res.json(order);
        return res.json(orderExist);
    }
}

export default new OrderController();
