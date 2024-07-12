import sequelize from '../sequelize.js'; 
import fs from 'fs';
import path from 'path';

 

const syncModels = async () => {
  const schemaDir = "models";
  const files = fs.readdirSync(schemaDir);
  console.log(files);
  for (const file of files) {
    if (file.endsWith("Schema.js")) {
      const filePath = path
        .join(process.cwd(), schemaDir, file)
        .replace(/\\/g, "/");
      const module = await import(`file://${filePath}`);
      const model = module.default;
      await model.sync({ alter: true });
      console.log(`Model ${model.name} synchronized successfully.`);
      process.exit(0);
    }
  }
};

const alterTableIfColumnExists = async (tableName) => {
  const alterColumn = async (columnName, alterQuery) => {
    const result = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM information_schema.columns
      WHERE table_name = '${tableName}' AND column_name = '${columnName}';
    `, { type: sequelize.QueryTypes.SELECT });

    if (result[0].count > 0) {
      await sequelize.query(alterQuery);
      console.log(`Column ${columnName} in table ${tableName} altered successfully`);
    } else {
      console.log(`Table ${tableName} does not have '${columnName}' column`);
    }
  };

  try {
    await alterColumn('updated_at', `
      ALTER TABLE ${tableName} 
      CHANGE updated_at updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
    `);
    await alterColumn('created_at', `
      ALTER TABLE ${tableName} 
      CHANGE created_at created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
    `);
  } catch (err) {
    console.error(`Error altering table ${tableName}:`, err);
  }
};

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Sync the models
    await syncModels();

    // Sync the dataBases with the models
    // await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    // Fetch all table names from the database
    const tables = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = '${sequelize.config.database}';
    `, { type: sequelize.QueryTypes.SELECT });

    // Loop through each table and alter the table if the column exists
    for (const table of tables) {
      await alterTableIfColumnExists(table.table_name);
    }

    console.log('All tables were processed successfully.');
  } catch (error) {
    console.error('Unable to connect to the database or alter tables:', error);
  }
})();
