import * as Yup from 'yup';
import Order from '../models/Order';
import DeliveryProblem from '../models/DeliveryProblem';

class ProblemController {
    async index(req, res) {
        const { id } = req.params;

        const deliveryProblems = await DeliveryProblem.findAll({
            where: { delivery_id: id },
        });

        return res.json(deliveryProblems);
    }

    /* async index(req, res) {
        const { id } = req.params;

        const deliveryProblems = await DeliveryProblem.findAll({
            where: { delivery_id: id },
        });

        return res.json(deliveryProblems);
    } */

    async store(req, res) {
        const schema = Yup.object().shape({
            description: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails..' });
        }

        const { id } = req.params;

        const deliveryExist = await Order.findByPk(id);
        if (!deliveryExist) {
            return res.status(400).json({ error: 'Delivery is not exist.' });
        }

        const problem = await DeliveryProblem.create({
            description: req.body.description,
            delivery_id: id,
        });

        return res.json(problem);
    }

    // async update(req, res) {return res.json();}
}

export default new ProblemController();
