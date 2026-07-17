const router = require("express").Router();
const authRouter = require("./api/auth.routes");
const bookRouter = require("./api/books.routes");
const categoryRouter = require("./api/categories.routes");
const userRouter = require("./api/users.routes");

router.use("/api/auth", authRouter);
router.use("/api/books", bookRouter);
router.use("/api/categories", categoryRouter);
router.use("/api/users", userRouter);

module.exports = router;

