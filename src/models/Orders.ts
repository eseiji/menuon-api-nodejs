import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/pg";

export interface OrdersInstance extends Model {
  id_order: number;
  total: number;
  status: number;
  insertion_date: Date;
  deletion_date: Date;
  id_table: number;
  id_customer: number;
  id_employee: number;
}

export const Order = sequelize.define<OrdersInstance>(
  "Orders",
  {
    id_order: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    total: {
      type: DataTypes.FLOAT,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    insertion_date: {
      type: DataTypes.STRING,
    },
    deletion_date: {
      type: DataTypes.STRING,
    },
    id_table: {
      type: DataTypes.INTEGER,
    },
    id_customer: {
      type: DataTypes.INTEGER,
    },
    id_employee: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "orders",
    timestamps: false,
  }
);
