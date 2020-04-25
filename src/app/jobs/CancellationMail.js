import Mail from '../../lib/Mail';

class CancellationMail {
    get key() {
        return 'CancellationMail';
    }

    async handle({ data }) {
        const { deliverymanExist, product, problem } = data;

        await Mail.sendMail({
            to: `${deliverymanExist.name} <${deliverymanExist.email}>`,
            subject: 'FastFeet - Encomenda cancelada',
            template: 'cancellationMail',
            context: {
                deliveryman: deliverymanExist.name,
                product,
                problem,
            },
        });
    }
}

export default new CancellationMail();
