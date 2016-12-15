var express = require('express');
var app = express();

var router = express.Router();

var Budget = require("../models/expenditures").Budget;

router.get("/:ico",function(req,res){
	var dashboard = {
		expenditures: null,
		income: null
	};
	Budget.find({ico:req.params.ico}, "ico year budgetAmount expenditureAmount", (err,items) => {
		if(items) dashboard.expenditures = err ? [] : items;
		res.json(dashboard);
	});
});


module.exports = router;