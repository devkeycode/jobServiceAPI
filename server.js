const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dbConfig = require("./configs/db.config");
const serverConfig = require("./configs/server.config");
const User = require("./models/user.model");
const express = require("express");

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Initialize the connection to the mongoDB
 */
mongoose.connect(dbConfig.DB_URI);
const db = mongoose.connection;
db.on("error", () => {
  console.log("Error while connecting to MongoDB");
});
db.once("open", () => {
  console.log("Connected to mongoDB");
  init();
});

/**
 * Create the ADMIN user at the boot time
 */
async function init() {
  try {
    const user = await User.findOne({ userId: "admin" });
    //creating admin user
    if (!user) {
      const adminUser = await User.create({
        name: "John Doe",
        userId: "admin",
        password: bcrypt.hashSync("password", 8),
        email: "admin@email.com",
        userType: "ADMIN",
        userStatus: "APPROVED",
      });
      console.log("Admin user created.", adminUser);
    }
  } catch (err) {
    console.log("err in db initialization , " + err);
  }
}

//routes middlewares, connect route to server by passing app object,so routes attached to the server
require("./routes/auth.route")(app);
require("./routes/company.route")(app);
require("./routes/user.route")(app);
require("./routes/job.route")(app);

//in case of endpoint ,not exists, send the 404 response
app.use((req, res) => {
  res.status(404).json({
    message: "The requested endpoint doesn't exists.",
  });
});

app.listen(serverConfig.PORT, () => {
  console.log(`App started listening on port ${serverConfig.PORT}`);
});
