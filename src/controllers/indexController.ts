import { Request, Response } from "express";
import { sequelize } from "../instances/pg";
import { Company } from "../models/Companies";

export const main = (req: Request, res: Response) => {
  res.json({ msg: "Server is running and API is available." });
};

export const listCompanies = async (req: Request, res: Response) => {
  try {
    let companies = await Company.findAll({ where: { deletion_date: null } });
    res.json(companies);
  } catch (error) {
    res.status(204);
    res.json({ error: error });
  }
};

export const listCompany = async (req: Request, res: Response) => {
  try {
    let id_company = req.params.id_company;
    let company = await Company.findByPk(id_company);
    res.status(201);
    res.json(company);
  } catch (error) {
    res.status(204);
    res.json({ error: error });
  }
};

export const insertCompany = async (req: Request, res: Response) => {
  try {
    let { name, cnpj } = req.body;
    let date = new Date();
    let insertion_date = date.toLocaleDateString("pt-BR");

    let newCompany = await Company.create({ name, cnpj, insertion_date });

    res.status(201);
    res.json({
      msg: "Company was successfully created.",
      id: newCompany.id_company,
      name,
      cnpj,
      insertion_date,
    });
  } catch (error) {
    res.status(204);
    res.json({ error: error });
  }
};
