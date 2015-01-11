Meteor.methods({
	'addSales': function(sales, date) {
		var doc = {
			"sales": sales,
			"date": date,
			"createdOn": new Date()
		}
		console.log("New Revenue entry created", {"date": date, "sales": sales});
		return Revenue.insert(doc);

	}
});