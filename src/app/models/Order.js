import Sequelize, { Model } from 'sequelize';

class Order extends Model {
    static init(sequelize) {
        super.init(
            {
                recipient_id: Sequelize.INTEGER,
                deliveryman_id: Sequelize.INTEGER,
                product: Sequelize.STRING,
                start_date: Sequelize.DATE,
                end_date: Sequelize.DATE,
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Recipients, {
            foreignKey: 'recipient_id',
            as: 'recipient',
        });
        this.belongsTo(models.Deliveryman, {
            foreignKey: 'deliveryman_id',
            as: 'deliveryman',
        });
        this.belongsTo(models.File, {
            foreignKey: 'signature_id',
            as: 'signature',
        });
    }
}

export default Order;
