Template.shiftDetail.helpers({
	'sales': function() {
		var sales = Revenue.findOne({"date": this.date});
		if(sales) {
			return sales.sales;
		}
	},

	'addSalesPermission': function() {
		var sales = Revenue.findOne({"date": this.date});
		if(sales) {
			return false;
		} else {
			return true;
		}
	}
});

Template.shiftDetail.events({
	'click .showSubmitSalesModal': function() {
		Session.set("thisDay", this);
		$("#addSales").modal("show");
	}
});