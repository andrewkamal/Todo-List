import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todolist",
  password: "Password123",
  port: 5432,
});

db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function GetAllItems() {
  var items = [];
  const result = await db.query("SELECT * FROM items ORDER BY id ASC");
  for (let row of result.rows) {
    items.push(row);
  }
  return items;
}

app.get("/", async (req, res) => {
  const items = await GetAllItems();
  res.render("index.ejs", {
    listTitle: "Todo List",
    listItems: items
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (item) VALUES ($1)", [item], (err, res) => {
    if (err)
      console.log(err);
    else
      console.log("Item added successfully");
  });
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItem;
  const id = req.body.updatedItemId;
  await db.query("UPDATE items SET item = $1 WHERE id = $2", [item, id], (err, res) => {
    if (err)
      console.log(err);
    else
      console.log("Item updated successfully");
  });
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id = $1", [id], (err, res) => {
    if (err)
      console.log(err);
    else
      console.log("Item deleted successfully");
  });
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
