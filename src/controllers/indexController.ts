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
    });
    Product.belongsToMany(Order, {
      through: { model: OrderProducts },
      foreignKey: "id_product",
    });

    Order.belongsTo(User, { foreignKey: "id_customer" });

    let orders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ["id_user", "name", "cpf", "email"],
          required: true,
        },
        {
          model: Product,
          required: true,
          attributes: ["id_product", "name", "preparation_time"],
          through: { attributes: ["quantity_sold"] },
        },
      ],
      where: { deletion_date: null },
    });
    // const [orders, metadata] = await sequelize.query(
    //   "SELECT `User`.`id`,`User`.`firstName`,`Invoices`.`id` AS `Invoices.id`,`Invoices`.`total` AS `Invoices.total`,`Invoices`.`UserId` AS `Invoices.UserId`,`Invoices`.`CityId` AS `Invoices.CityId`,`Invoices->City`.`id` AS `Invoices.City.id`,`Invoices->City`.`cityName` AS `Invoices.City.cityName` FROM `Users` AS `User` LEFT OUTER JOIN `Invoices` AS `Invoices` ON `User`.`id` = `Invoices`.`UserId` LEFT OUTER JOIN `Cities` AS `Invoices->City` ON `Invoices`.`CityId` = Invoices->City`.`id` WHERE `User`.`id` = 1;",
    //   { nest: true, type: QueryTypes.SELECT }
    // );
    // const [orders, metadata] = await sequelize.query(
    //   `SELECT orders.id_order, users.name, users.cpf, products.id_product as ["products.id_product"], products.name as "products.name", products.preparation_time as "products.preparation_time", order_products.quantity_sold as "products.quantity_sold"
    //   FROM

    //   ((orders INNER JOIN order_products ON orders.id_order = order_products.id_order)
    //   INNER JOIN products ON products.id_product = order_products.id_product)
    //   JOIN users ON (orders.id_customer = users.id_user)

    //   WHERE orders.deletion_date IS NULL
    //   AND users.deletion_date IS NULL AND order_products.status = 0`,
    //   {
    //     nest: true,
    //     type: QueryTypes.SELECT,
    //   }
    // );

    // orders.forEach(async (order: { id_order: number }) => {
    //   const [products] = await sequelize.query(
    //     "SELECT op.quantity_sold, p.name, p.preparation_time, op.status FROM order_products op JOIN products p ON p.id_product = op.id_product WHERE op.status = 0 AND op.id_order = ?",
    //     {
    //       replacements: [order.id_order],
    //       type: QueryTypes.SELECT,
    //     }
    //   );
    // });
    // const orders = await sequelize.query(
    //   'SELECT "Orders"."id_order", "Orders"."total", "Orders"."status", "Orders"."insertion_date", "Orders"."deletion_date", "Orders"."id_table", "Orders"."id_customer", "User"."id_user" AS "User.id_user", "User"."name" AS "User.name", "User"."cpf" AS "User.cpf", "User"."email" AS "User.email", "Products"."id_product" AS "Products.id_product", "Products"."name" AS "Products.name", "Products"."preparation_time" AS "Products.preparation_time", "Products->OrderProducts"."id_order_products" AS "Products.OrderProducts.id_order_products", "Products->OrderProducts"."quantity_sold" AS "Products.OrderProducts.quantity_sold" FROM "orders" AS "Orders" INNER JOIN "users" AS "User" ON "Orders"."id_customer" = "User"."id_user" INNER JOIN ( "order_products" AS "Products->OrderProducts" INNER JOIN "products" AS "Products" ON "Products"."id_product" = "Products->OrderProducts"."id_product") ON "Orders"."id_order" = "Products->OrderProducts"."id_order" WHERE "Orders"."deletion_date" IS NULL;',
    //   { nest: true, plain: true }
    // );
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

// USERS

export const login = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;

    let user = await User.findOne({ where: { email, password } });
    if (user) {
      res.status(200);
      res.json({
        msg: "User found.",
        id_user: user?.id_user,
        name: user?.name,
        email: user?.email,
      });
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(204);
    res.json({ error: error });
  }
};
