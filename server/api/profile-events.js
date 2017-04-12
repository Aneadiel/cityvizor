var express = require('express');	
var app = express();

var router = express.Router({mergeParams: true});

var acl = require("express-dynacl");

var Event = require("../models/expenditures").Event;
var EventBudget = require("../models/expenditures").EventBudget;
var Invoice = require("../models/expenditures").Invoice;


router.get("/", acl("profile-events", "list"), (req,res) => {
	
	var fields = req.body.fields ? req.body.fields : "event name";
	
	Event.find({profile:req.params.profile}).select(fields)
		.then(events => res.json(events ? events : []))
		.catch(err => res.status(500).send(err));
	
});

router.get("/timeline/:year", acl("profile-events", "list"), acl("profile-invoices", "list"), (req,res) => {

	Event.find({profile:req.params.profile}).select("event name").lean()
		.then(events => events ? events : [])
		.then(events => {
		
			var eventIndex = {};
			events.forEach(event => {
				eventIndex[event.event] = event;
				event.invoices = [];
				event.amount = 0;
				
				event.invoiceMaxAmount = 0;
				
				event.dateFirst = null;
				event.dateLast = null;
			});		
			
			Invoice.find({profile: req.params.profile, event: {$in: events.map(event => event.event)}, year: Number(req.params.year)}).select("event date amount")
				.then(invoices => {
					invoices.forEach(invoice => {
						eventIndex[invoice.event].invoices.push(invoice);
						eventIndex[invoice.event].amount += invoice.amount;
						
						if (eventIndex[invoice.event].invoiceMaxAmount < invoice.amount) eventIndex[invoice.event].invoiceMaxAmount = invoice.amount;
						
						if (eventIndex[invoice.event].dateFirst===null || eventIndex[invoice.event].dateFirst>invoice.date) eventIndex[invoice.event].dateFirst = invoice.date;
						if (eventIndex[invoice.event].dateLast===null || eventIndex[invoice.event].dateLast<invoice.date) eventIndex[invoice.event].dateLast = invoice.date;
					});
					res.json(events);
				});
		})
		.catch(err => res.status(500).send(err));
	
});

router.get("/:event", acl("profile-events", "list"), (req,res) => {
	
	Event.findOne({profile:req.params.profile,event:req.params.event}).lean()
		.then(event => {
			let queries = [];
			queries.push(EventBudget.find({profile:req.params.profile,event:req.params.event}).lean().then(budgets => event.budgets = budgets).catch(err => res.status(500).send(err)));
			queries.push(Invoice.find({profile:req.params.profile,event:req.params.event}).lean().then(invoices => event.invoices = invoices).catch(err => res.status(500).send(err)));
			Promise.all(queries).then(() => res.json(event));
		})
		.catch(err => res.status(500).send(err));
	
});

module.exports = router;