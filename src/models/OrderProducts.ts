import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/pg";

export interface OrderProductsInstance extends Model {
  id_order_products: number;
  id_order: number;
  id_product: number;
  quantity_sold: number;
  product_price: number;
  status: number;
  insertion_date: Date;
  deletion_date: Date;
}

export const OrderProducts = sequelize.define<OrderProductsInstance>(
  "OrderProducts",
  {
    id_order_products: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    id_order: {
      type: DataTypes.INTEGER,
    },
    id_product: {
      type: DataTypes.INTEGER,
    },
    quantity_sold: {
      type: DataTypes.INTEGER,
    },
    product_price: {
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
  },
  {
    tableName: "order_products",
    timestamps: false,
  }
);
