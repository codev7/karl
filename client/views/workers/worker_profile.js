Template.workerProfile.helpers({
  'worker': function() {
    var worker = Session.get("thisWorker");
    return worker;
  },


});

Template.workerProfile.events({
  'submit form': function(event, instance) {
    event.preventDefault();
    var name = $(event.target).find('[name=name]').val();
    var type = $(event.target).find('[name=type]').val();
    var wage = $(event.target).find('[name=wage]').val();
    var limit = $(event.target).find('[name=hours]').val();

    if(!name || name.trim() == "") {
      return alert("Please add title for your worker");
    } else {
      var info = {
        "_id": $(event.target).attr("data-id"),
        "name": name,
        "type": type,
        "wage": wage,
        "limit": limit
      }
      Meteor.call("editWorker", info, function(err, id) {
        if(err) {
          return alert(err.reason);
        } else {
          $("#workerProfileModal").modal("hide");
        }
      });
    }
  },

  'click .deleteWorker': function(event, instance) {
    var id = $(event.target).attr("data-id");
    if(!id) {
      return alert("Worker does not have an id");
    } else {
      Meteor.call("deleteWorker", id, function(err) {
        if(err) {
          return alert(err.reason);
        } else {
          $("#workerProfileModal").modal("hide");
        }
      });
    }
  },

  'click .add-holidays': function(event) {
    console.log("---------", setDates);
  }
});

Template.workerProfile.rendered = function() {
  var date = moment(new Date()).format("YYYY-MM-DD");
  var dates = getDaysOfMonth(date);
  var dates_before = [];

  Tracker.autorun(function() {
    var worker = Session.get("thisWorker");
    if($('.datepicker.datepicker-inline')) {
      $(".calendar").datepicker("remove");
    }
    if(worker) {
      var workerId = worker._id;
      $(".calendar").on('show', function(ev) {
        setTimeout(function() {
          var holi = Holidays.find({"date": {$gte: dates.start, $lte: dates.end}, "workers": {$all: [workerId]}}).fetch();
          var holidays_of_month = [];
          if(holi.length > 0) {
            holi.forEach(function(obj) {
              holidays_of_month.push(new Date(moment(obj.date).format("YYYY-M-D")));
              dates_before.push(obj.date);
              
            });
            $(".calendar").datepicker("setDates", holidays_of_month);
          }
        }, 1000);
      }).datepicker({
        multidate: true,
        multidateSeparator: '-',
        todayBtn: "linked",
        todayHighlight: true
      }).on("changeDate", function(ev) {
        var date = moment(ev.date).format("YYYY-MM-DD");
        var data = {"state": "add", "onHoliday": true, "date": date};

        if(dates_before.length > ev.dates.length) {
          var event_dates = [];
          ev.dates.forEach(function(date) {
            event_dates.push(moment(date).format("YYYY-MM-DD"));
          });
          dates_before.forEach(function(date) {
            if($.inArray(date, event_dates) < 0) {
              console.log("-------remove");
              data.state = "remove";
              data.onHoliday = false;
              data.date = date;
            }
          });
        }
        Meteor.call("setLeave", workerId, data.date, data.onHoliday, function(err) {
          if(err) {
            return alert(err.reason);
          } else {
            if(data.onHoliday) {
              dates_before.push(data.date);
            }
          }
        });
      }).on("changeMonth", function(ev) {
        var date = moment(ev.date).format("YYYY-MM-DD");
        var dates = getDaysOfMonth(date);
        Meteor.subscribe("monthlyHolidays", dates.start, dates.end);
      });
    }
  });
  
 
}