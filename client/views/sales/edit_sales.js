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
		var salesObjc = Sales.findOne({"date": date});
		if(!salesObjc) {
			return alert("Add sales first");
		}
		Meteor.call("editSales",salesObjc._id, date, sales, function(err) {
			if(err) {
				console.log(err.reason);
				return;
			} else {
				$("#editSales").modal("hide");
			}
		});
	},

	'focus .form_date': function(event) {
		$(".form_date").datetimepicker({
      language:  'fr',
      weekStart: 1,
      todayBtn:  1,
      autoclose: 1,
      todayHighlight: 1,
      startView: 2,
      minView: 2,
      forceParse: 0
    })
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