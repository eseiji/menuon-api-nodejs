import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/pg";

export interface CategoriesInstance extends Model {
  id_category: number;
  name: string;
  insertion_date: string;
  deletion_date: Date;
  id_company: number;
  order: number;
}

export const Category = sequelize.define<CategoriesInstance>(
  "Categories",
  {
    id_category: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
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
  order: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "categories",
    timestamps: false,
  }
);
