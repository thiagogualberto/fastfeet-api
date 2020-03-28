import Sequelize, { Model } from 'sequelize';

class Recipients extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                address: Sequelize.STRING,
                number: Sequelize.INTEGER,
                complement: Sequelize.STRING,
                state: Sequelize.STRING,
                city: Sequelize.STRING,
                postalcode: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
        return this;
    }
}

export default Recipients;
