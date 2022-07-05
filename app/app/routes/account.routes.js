const accounts = require("../controllers/account.controller.js");

module.exports = app => {
  const accounts = require("../controllers/account.controller.js");
  const router = require("express").Router();

  router.post("/", accounts.create);
  router.get("/", accounts.list);
  router.get("/:key", accounts.findOne);
  router.delete("/:key", accounts.delete);
  router.delete("/", accounts.deleteAll);
  router.post("/transaction", accounts.addTransaction);

  app.use("/api/accounts", router);
};
