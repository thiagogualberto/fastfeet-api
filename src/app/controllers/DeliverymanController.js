import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
    async index(req, res) {
        const { page } = req.query;

        const deliverymens = await Deliveryman.findAll({
            attributes: ['id', 'name', 'email', 'avatar_id'],
            order: ['created_at'],
            limit: 5,
            offset: (page - 1) * 5,
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['name', 'path', 'url'],
                },
            ],
        });

        return res.json(deliverymens);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            avatar_id: Yup.number(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails..' });
        }

        const deliverymanExist = await Deliveryman.findOne({
            where: { email: req.body.email },
        });

        if (deliverymanExist) {
            return res
                .status(400)
                .json({ error: 'Deliveryman already exists.' });
        }

        const { id, name, email, avatar_id } = await Deliveryman.create(
            req.body
        );

        return res.json({
            id,
            name,
            email,
            avatar_id,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number(),
            name: Yup.string(),
            email: Yup.string().email(),
            avatar_id: Yup.number(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails..' });
        }

        const deliveryman = await Deliveryman.findOne({ where: req.body.id });

        if (!deliveryman) {
            return res
                .status(400)
                .json({ error: 'Deliveryman does not exist.' });
        }

        const { id, name, email, avatar_id } = await deliveryman.update(
            req.body
        );

        return res.json({
            id,
            name,
            email,
            avatar_id,
        });
    }

    async delete(req, res) {
        const id = await req.params.id;
        const deliverymanExist = await Deliveryman.findByPk(id, {
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['name', 'path'],
                },
            ],
        });

        if (!deliverymanExist) {
            return res
                .status(400)
                .json({ error: 'Deliveryman is not exists.' });
        }

        const avatarExists = await File.findByPk(deliverymanExist.avatar_id);

        if (avatarExists) {
            await File.destroy({
                where: {
                    id: avatarExists.id,
                },
            });
        }

        await deliverymanExist.destroy();

        return res.status(204).send();
    }
}

export default new DeliverymanController();
