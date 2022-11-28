import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/pg";

export interface PaymentsInstance extends Model {
  id_payment: number;
  id_order: number;
  identification: string;
  insertion_date: string;
  deletion_date: string;
  update_date: string;
  status: number;
}

export const Payment = sequelize.define<PaymentsInstance>(
  "Payments",
  {
    id_payment: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    id_order: {
      type: DataTypes.INTEGER,
    },
    identification: {
      type: DataTypes.STRING,
    },
    insertion_date: {
      type: DataTypes.STRING,
    },
    deletion_date: {
      type: DataTypes.STRING,
    },
    update_date: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "payment",
    timestamps: false,
  }
);
