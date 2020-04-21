import * as Yup from 'yup';
import Recipient from '../models/Recipients';

class RecipientController {
    async show(req, res) {
        const { id } = req.params;

        const {
            name,
            address,
            number,
            state,
            city,
            postalcode,
        } = await Recipient.findByPk(id);

        return res.json({ name, address, number, state, city, postalcode });
    }

    async index(req, res) {
        const all_recipients = await Recipient.findAll({
            attributes: [
                'name',
                'address',
                'number',
                'state',
                'city',
                'postalcode',
            ],
        });

        return res.json(all_recipients);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            address: Yup.string().required(),
            number: Yup.number().required(),
            complement: Yup.string(),
            state: Yup.string()
                .required()
                .uppercase()
                .length(2),
            city: Yup.string().required(),
            postalcode: Yup.string()
                .required()
                .length(8),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails. ' });
        }
        const {
            id,
            name,
            address,
            number,
            complement,
            state,
            city,
            postalcode,
        } = await Recipient.create(req.body);

        return res.json({
            id,
            name,
            address,
            number,
            complement,
            state,
            city,
            postalcode,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            address: Yup.string().required(),
            number: Yup.number().required(),
            complement: Yup.string(),
            state: Yup.string()
                .required()
                .uppercase()
                .length(2),
            city: Yup.string().required(),
            postalcode: Yup.string()
                .required()
                .length(8),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails. ' });
        }

        const updateRecipient = await Recipient.findByPk(req.params.id);

        // console.log(recipient);

        if (!updateRecipient) {
            return res.status(401).json({ error: 'Recipient not exist. ' });
        }

        const {
            id,
            name,
            address,
            number,
            complement,
            state,
            city,
            postalcode,
        } = await updateRecipient.update(req.body);

        return res.json({
            id,
            name,
            address,
            number,
            complement,
            state,
            city,
            postalcode,
        });
    }

    async delete(req, res) {
        const recipientExist = await Recipient.findByPk(req.params.id);
        if (!recipientExist) {
            return res.status(400).json({ error: 'Order is not exist.' });
        }

        await recipientExist.destroy();

        return res.status(204).send();
    }
}

export default new RecipientController();
