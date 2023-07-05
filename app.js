require("dotenv").config();
require("express-async-errors");
const path = require("path");

// extra security packages
const xss = require("xss-clean");
const helmet = require("helmet");

const express = require("express");
const app = express();

// Connect DB
const connectDB = require("./db/connect");

// Protected route authentication
const authenticatedUser = require("./middleware/authentication");

// Routers
const AuthRouter = require("./routes/auth");
const JobsRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// app.set("trust proxy", 1);

app.use(express.static(path.resolve(__dirname, "./client/build")));

app.use(express.json());
//extra packages
app.use(helmet());
app.use(xss());

// routes
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/jobs", authenticatedUser, JobsRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.get("/", (req, res) => {
  res.send("jobs api");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    console.log("Server running");
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
