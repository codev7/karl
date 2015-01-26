Template.submitSales.events({
	'submit form': function(event) {
    event.preventDefault();
		var date = $(event.target).find('[name=date]').val();
		var sales = $(event.target).find('[name=salesRevenue]').val();
		console.log(date, sales);
		if(!date) {
			return alert("Enter date");
		} 
		if(!sales) {
			return alert("Enter sales revenue");
		}
		Meteor.call("createSales", sales, date, function(err) {
			if(err) {
				console.log(err.reason);
				return;
			} else {
				$("#addSales").modal("hide");
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

Template.submitSales.helpers({
	'date': function() {
		var thisDate = Session.get("thisDay");
		if(thisDate) {
			return thisDate;
		}
	}
});