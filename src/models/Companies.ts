import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/pg";

export interface CompaniesInstance extends Model {
  id_company: number;
  name: string;
  cnpj: string;
  insertion_date: Date;
  deletion_date: Date;
}

export const Company = sequelize.define<CompaniesInstance>(
  "Companies",
  {
    id_company: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    cnpj: {
      type: DataTypes.STRING,
    },
    insertion_date: {
      type: DataTypes.DATE,
    },
    deletion_date: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "companies",
    timestamps: false,
  }
);
