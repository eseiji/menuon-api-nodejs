import { Request, Response } from "express";
import { sequelize } from "../instances/pg";
import { Company } from "../models/Companies";
import { Order } from "../models/Orders";
import { OrderProducts } from "../models/OrderProducts";
import { Product } from "../models/Products";
import { debuglog } from "util";

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

// PRODUCT - ORDERS

export const listOrders = async (req: Request, res: Response) => {
  try {
    let orders = await Order.findAll({
      where: { deletion_date: null },
    });
    res.json(orders);
  } catch (error) {
    res.status(204);
    res.json({ error: error });
  }
};

export const listOrderProducts = async (req: Request, res: Response) => {
  try {
    const [orders, metadata] = await sequelize.query(
      "SELECT o.id_order, op.quantity_sold, p.name, p.preparation_time, op.status FROM orders o JOIN order_products op ON op.id_order = o.id_order JOIN products p ON p.id_product = op.id_product WHERE o.deletion_date IS NULL AND op.status = 0"
    );
    res.json(orders);
  } catch (error) {
    res.status(204);
    res.json({ error: error });
  }
};

export const insertOrder = async (req: Request, res: Response) => {
  try {
    let { total, status, id_table, id_customer } = req.body;
    let date = new Date();
    let insertion_date = date.toLocaleDateString("pt-BR");

    let newOrder = await Order.create({
      total,
      status,
      id_table,
      id_customer,
      insertion_date,
    });

    res.status(201);
    res.json({
      msg: "Order was successfully created.",
      id: newOrder.id_order,
      total: newOrder.total,
      status: newOrder.status,
      id_table: newOrder.id_table,
      id_customer: newOrder.id_customer,
      insertion_date: newOrder.insertion_date,
    });
  } catch (error) {
    res.status(204);
    res.json({ error: error });
  }
};

export const insertOrderProducts = async (req: Request, res: Response) => {
  try {
    let { id_order, id_product, quantity_sold, product_price, status } =
      req.body;
    let date = new Date();
    let insertion_date = date.toLocaleDateString("us");
    let [day, month, year] = insertion_date.split("/");
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    await OrderProducts.create({
      id_order,
      id_product,
      quantity_sold,
      product_price,
      status,
      insertion_date: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
    });
    res.status(201);
    res.json({
      msg: "OrderProducts was successfully created.",
    });
  } catch (error) {
    debuglog(JSON.stringify(error));
    res.status(204);
    res.json({ error: error });
  }
};
