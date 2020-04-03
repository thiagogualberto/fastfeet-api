import Mail from '../../lib/Mail';

class NewDeliverMail {
    get key() {
        return 'NewDeliverMail';
    }

    async handle({ data }) {
        const { deliverymanExist, product, recipientExist } = data;

        await Mail.sendMail({
            to: `${deliverymanExist.name} <${deliverymanExist.email}>`,
            subject: 'FastFeet - Nova encomenda disponível para retirada',
            template: 'newDeliver',
            context: {
                deliveryman: deliverymanExist.name,
                product,
                recipient: recipientExist.name,
                address: recipientExist.address,
                number: recipientExist.number,
                city: recipientExist.city,
                state: recipientExist.state,
                postalcode: recipientExist.postalcode,
            },
        });
    }
}

export default new NewDeliverMail();
