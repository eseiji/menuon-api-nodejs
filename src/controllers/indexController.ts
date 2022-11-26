import { Request, Response } from "express";
import { sequelize } from "../instances/pg";
import { Company } from "../models/Companies";
import { Order } from "../models/Orders";
import { OrderProducts } from "../models/OrderProducts";
import { Product } from "../models/Products";
import { User } from "../models/Users";
import { Category } from "../models/Categories";
import { debuglog } from "util";
import { QueryTypes } from "sequelize";

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
    res.status(200);
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

    res.status(200);
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

interface OrderProps {
  id_order: string;
  total: string;
  order_status: string;
  products: unknown[];
}

export const listOrders = async (req: Request, res: Response) => {
  try {
    Order.belongsToMany(Product, {
      through: { model: OrderProducts },
      foreignKey: "id_order",
      // as: {singular: "product", plural: "products"},
    });
    Product.belongsToMany(Order, {
      through: { model: OrderProducts },
      foreignKey: "id_product",
    });

    Order.belongsTo(User, {
      foreignKey: "id_customer",
      // as: {singular: "user", plural: "users"},
    });

    let orders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ["id_user", "name", "cpf", "email"],
          required: true,
          // as: "user",
          where: { deletion_date: null },
        },
        {
          model: Product,
          // as: "products",
          required: true,
          where: { deletion_date: null },
          attributes: ["id_product", "name", "preparation_time", "priority"],
          through: {
            attributes: ["quantity_sold"],
            where: { status: 0 },
            as: "sales",
          },
        },
      ],
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
    let { total, status, id_table, id_customer, id_employee, id_company } =
      req.body;
    let date = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
    // let local_date = date.toLocaleDateString("pt-BR");
    // local_date.replace("/", "-");
    // let local_time = date.toLocaleTimeString("pt-BR");
    // let insertion_date = `${local_date}T${local_time}` as String;

    // let local_date = date.toLocaleDateString("pt-BR");
    // let [day, month, year] = local_date.split("/");
    // let hours = date.getHours();
    // let minutes = date.getMinutes();
    // let seconds = date.getSeconds();

    // let insertion_date = `${day.padStart(2, "0")}-${month.padStart(
    //   2,
    //   "0"
    // )}-${year.padStart(2, "0")}T${String(hours).padStart(2, "0")}:${String(
    //   minutes
    // ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    let newOrder = await Order.create({
      total,
      status,
      id_table,
      id_customer,
      id_employee,
      insertion_date: date,
      id_company: id_company,
    });

    res.status(200);
    res.json({
      id: newOrder.id_order,
      total: newOrder.total,
      status: newOrder.status,
      id_table: newOrder.id_table,
      id_customer: newOrder.id_customer,
      id_employee: newOrder.id_employee,
      insertion_date: newOrder.insertion_date,
      id_company: id_company,
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
    let date = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
    // let insertion_date = date.toLocaleDateString("pt-BR");
    // let [day, month, year] = insertion_date.split("/");
    // let hours = date.getHours();
    // let minutes = date.getMinutes();
    // let seconds = date.getSeconds();
    // let local_date = date.toLocaleDateString("pt-BR");
    // let local_time = date.toLocaleTimeString("pt-BR");
    // const insertion_date = `${local_date}T${local_time}`;

    await OrderProducts.create({
      id_order,
      id_product,
      quantity_sold,
      product_price,
      status,
      insertion_date: date,
    });
    res.status(200);
    res.json({
      msg: "OrderProducts was successfully created.",
    });
  } catch (error) {
    debuglog(JSON.stringify(error));
    res.status(204);
    res.json({ error: error });
  }
};

export const listProducts = async (req: Request, res: Response) => {
  try {
    let { id_company, id_category } = req.params;

    const products = await Product.findAll({
      where: { id_company, id_category, deletion_date: null },
    });

    if (products) {
      res.status(200);
      res.json({
        msg: "Products found.",
        products,
      });
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(204);
    res.json({ error: error });
  }
};

export const listProduct = async (req: Request, res: Response) => {
  try {
    let { id_product } = req.params;

    const product = await Product.findOne({
      where: { id_product, deletion_date: null },
    });

    if (product) {
      res.status(200);
      res.json(product);
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(204);
    res.json({ error: error });
  }
};

export const listCategories = async (req: Request, res: Response) => {
  try {
    let { id_company } = req.params;

    const categories = await Category.findAll({
      where: { id_company, deletion_date: null },
    });

    if (categories) {
      res.status(200);
      res.json({
        msg: "Categories found.",
        categories,
      });
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(204);
    res.json({ error: error });
  }
};

export const listOrderHistory = async (req: Request, res: Response) => {
  try {
    let { id_user, id_company, id_table } = req.params;

    const [order_history, metadata] = await sequelize.query(
      'select o.id_order, o.total, o.status  from users u join orders o on u.id_user = o.id_customer join "tables" t on t.id_table = o.id_table join companies c on o.id_company = c.id_company where u.id_user = :id_user and t.id_table = :id_table and c.id_company = :id_company and o.deletion_date IS NULL and u.deletion_date IS NULL and c.deletion_date IS NULL ORDER by o.insertion_date DESC',
      {
        replacements: { id_user, id_table, id_company },
        // type: QueryTypes.SELECT,
        // raw: true,
        // plain: false,
        // nest: true,
      }
    );

    // const categories = await Category.findAll({
    //   where: { id_company, deletion_date: null },
    // });

    if (order_history) {
      res.status(200);
      res.json(order_history);
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(204);
    res.json({ error: error });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    let { id_order, status } = req.body;
    let date = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    await Order.update({ status: status }, { where: { id_order: id_order } });

    res.status(200);
    res.json();
  } catch (error) {
    res.status(204);
    res.json({ error: error });
  }
};

// USERS

export const login = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;

    const [user, metadata] = await sequelize.query(
      'select * from users u join customers c on c.id_customer = u.id_user and u.deletion_date is null and u.email = :email and u."password" = :password',
      {
        replacements: { email, password },
        // type: QueryTypes.SELECT,
        // raw: true,
        // plain: false,
        // nest: true,
      }
    );

    // let user = await User.findOne({ where: { email, password } });
    if (user) {
      res.status(200);
      res.json(user);
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(204);
    res.json({ error: error });
  }
};
