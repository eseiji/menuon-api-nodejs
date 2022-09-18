import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/pg";

export interface UsersInstance extends Model {
  id_user: number;
  name: string;
  phone_number: string;
  cpf: string;
  email: string;
  password: string;
  insertion_date: string;
  deletion_date: Date;
}

export const User = sequelize.define<UsersInstance>(
  "Users",
  {
    id_user: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    cpf: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },

    insertion_date: {
      type: DataTypes.STRING,
    },
    deletion_date: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);
