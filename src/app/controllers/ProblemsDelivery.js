import Order from '../models/Order';
import DeliveryProblem from '../models/DeliveryProblem';
import DeliveryMan from '../models/Deliveryman';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class ProblemsDelivery {
    async index(req, res) {
        const deliveryProblems = await DeliveryProblem.findAll({
            attributes: ['id', 'delivery_id', 'description'],
        });
        return res.json(deliveryProblems);
    }

    async update(req, res) {
        const problem_id = req.params.id;

        const problem = await DeliveryProblem.findByPk(problem_id);

        const orderExist = await Order.findByPk(problem.delivery_id);

        if (orderExist.end_date !== null) {
            return res.status(400).json({ error: 'Order already delivered.' });
        }
        if (orderExist.canceled_at !== null) {
            return res.status(400).json({ error: 'Order already cancelled.' });
        }

        await orderExist.update({ canceled_at: new Date() });

        const deliverymanExist = await DeliveryMan.findByPk(
            orderExist.deliveryman_id
        );

        await Queue.add(CancellationMail.key, {
            deliverymanExist,
            product: orderExist.product,
            problem: problem.description,
        });

        return res.json(orderExist);
    }
}

export default new ProblemsDelivery();
