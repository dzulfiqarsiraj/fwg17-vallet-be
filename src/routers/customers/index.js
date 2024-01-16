const customerRouter = require("express").Router();

// end point
customerRouter.use("/contact-list", require("./contactList.router"))
customerRouter.use("/history-transaction", require("./historyTransactions.router"))

module.exports = customerRouter