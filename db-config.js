import mysql from "mysql";
import util from "util";
const config = {
  host: "localhost",
  user: "root",
  password: "",
  database: "proj_test",
};


export const makeDb = () => {
  const connection = mysql.createConnection(config);
  return {
    query(sql, args) {
      return util.promisify(connection.query).call(connection, sql, args);
    },
    close() {
      return util.promisify(connection.end).call(connection);
    },
  };
};
