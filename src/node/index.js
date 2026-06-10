const express = require("express");
const app = express();
const port = 5637;
const cors = require("cors");
const { Pool } = require("pg");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const pool = new Pool({
  user: "user_5637",
  host: "db",
  database: "crm_5637",
  password: "pass_5637",
  port: 5432,
});
app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});
app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});
app.get("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const customerData = await pool.query("SELECT * FROM customers WHERE customer_id = $1", [id]);
    res.send(customerData.rows[0]);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});
app.delete("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM customers WHERE customer_id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});
app.put("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, industry, contact, location } = req.body;
    await pool.query(
      "UPDATE customers SET company_name = $1, industry = $2, contact = $3, location = $4 WHERE customer_id = $5",
      [companyName, industry, contact, location, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});
app.use(express.static("../web"));
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});