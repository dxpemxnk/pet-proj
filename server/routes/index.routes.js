const router = require("express").Router();
const authRouter = require("./api/auth.routes");
const bookRouter = require("./api/books.routes");

router.use("/api/auth", authRouter);
router.use("/api/books", bookRouter);

module.exports = router;

