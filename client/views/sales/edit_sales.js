Template.editSales.events({
	'submit form': function(event) {
    event.preventDefault();
		var date = $(event.target).find('[name=date]').val();
		var sales = $(event.target).find('[name=salesRevenue]').val();
		if(!date) {
			return alert("Enter date");
		} 
		if(!sales) {
			return alert("Enter sales revenue");
		}
		Meteor.call("editSales", sales, date, function(err) {
			if(err) {
				console.log(err.reason);
				return;
			} else {
				$("#editSales").modal("hide");
			}
		});
	}
});

Template.editSales.helpers({
	'sales': function() {
		var thisDate = Session.get("thisDay");
		var doc = {};
		if(thisDate) {
			doc.date = thisDate.date;
			var sales = Sales.findOne({"date": thisDate.date});
			if(sales) {
				doc.sales = sales.sales;
			}
			return doc;
		}
	}
});