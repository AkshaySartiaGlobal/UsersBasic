import { Sequelize } from 'sequelize';

// Create a new Sequelize instance
const sequelize = new Sequelize('proj_test', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
