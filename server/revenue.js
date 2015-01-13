Meteor.methods({
	'addSales': function(sales, date) {
		var doc = {
			"sales": sales,
			"date": date,
			"createdOn": new Date()
		}
		console.log("New Revenue entry created", {"date": date, "sales": sales});
		return Revenue.insert(doc);

	},

	'editSales': function(sales, date) {
		console.log("Update Revenue entry", {"date": date, "sales": sales});
		return Revenue.update({"date": date}, {$set: {"sales": sales}});
	}
});