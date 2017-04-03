var express = require('express');	
var app = express();

var router = express.Router({mergeParams: true});

var acl = require("express-dynacl");

var Budget = require("../models/expenditures").Budget;

router.get("/", acl("profile-budgets","list"), (req,res) => {
	
	Budget.find({profile:req.params.profile}).select("year budgetAmount expenditureAmount incomeAmount")
		.then(years => res.json(years ? years : []))
		.catch(err => res.status(500).send(err));

});

router.get("/:year", acl("profile-budgets", "read"), (req,res) => {
	
	Budget.findOne({profile:req.params.profile,year:req.params.year})
		.then(budget => budget ? res.json(budget) : res.sendStatus(404))
		.catch(err => res.sendStatus(500));
	
});

module.exports = router;