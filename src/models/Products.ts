import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/pg";

export interface ProductsInstance extends Model {
  id_product: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  id_category: number;
  insertion_date: string;
  deletion_date: Date;
  id_company: number;
  preparation_time: string;
  image_url: string;
  priority: number;
}

export const Product = sequelize.define<ProductsInstance>(
  "Products",
  {
    id_product: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
    },
    id_category: {
      type: DataTypes.INTEGER,
    },
    insertion_date: {
      type: DataTypes.STRING,
    },
    deletion_date: {
      type: DataTypes.DATE,
    },
    id_company: {
      type: DataTypes.INTEGER,
    },
    preparation_time: {
      type: DataTypes.STRING,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    priority: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);
