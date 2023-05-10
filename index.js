const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const user = require("./src/routes/userRoutes");
const operator = require("./src/routes/OperatorRoutes");
const {
  requireOperatorRole,
  requireAdminRole,
} = require("./src/middleware/authorization");
const admin = require("./src/routes/AdminRoutes");

const port = process.env.PORT;
const app = express();

//configure body parser,Parse incoming request bodies in a middleware before the handlers, available under req.body property
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//configure cors
app.use(cors({ origin: /http:\/\/localhost/ }));
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/user", user);

app.use("/operator", requireOperatorRole, operator);

app.use("/admin", requireAdminRole, admin);

// for an unknown Url

app.use((req, res) => {
  console.error(`Requested resource ${req.method} &${req.url} not found...!`);
  res.status(404).send("Resource not found");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
