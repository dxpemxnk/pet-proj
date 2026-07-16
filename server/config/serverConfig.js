const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const serverConfig = (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: ["http://localhost:5173"],
      optionsSuccessStatus: 200,
      credentials: true
    })
  );
  app.use(express.json());
  app.use(morgan("combined"));
  app.use(cookieParser());
};
module.exports = serverConfig;