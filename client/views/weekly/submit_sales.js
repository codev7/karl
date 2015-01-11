Template.submitSales.events({
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
		Meteor.call("addSales", sales, date, function(err) {
			if(err) {
				console.log(err.reason);
				return;
			} else {
				$("#addSales").modal("hide");
			}
		});
	}
});

Template.submitSales.helpers({
	'sales': function() {
		var revenue = Revenue.findOne({"date": this.date});
		console.log(revenue);
		if(revenue) {
			return revenue.sales;
		}
	}
});