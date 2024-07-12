
import sequelize from "../sequelize.js";
import { DataTypes } from "sequelize";

const UserSchema = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      required: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      required: true,
    },
    state_id: {
      type: DataTypes.INTEGER,
      required: true,
    },
    city_id: {
      type: DataTypes.INTEGER,
      required: true,
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  },
  {
    timestamps: true,
    underscored: true
  }
);


export default UserSchema;