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
  }
});

Template.workerProfile.rendered = function() {
  var self = this;
  var date = moment(new Date()).format("YYYY-MM-DD");
  var dates = getDaysOfMonth(date);
  var dates_before = [];

  this.autorun(function() {
    var holidays_of_month = [];
    var worker = Session.get("thisWorker");
    if(worker) {
      var workerId = worker._id;
      self.$(".calendar").datepicker("remove");
      setTimeout(function() {
        var holi = Holidays.find({"date": {$gte: dates.start, $lte: dates.end}, "workers": {$all: [workerId]}}).fetch();
        if(holi.length > 0) {
          holi.forEach(function(obj) {
            var date = new Date(obj.date);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            holidays_of_month.push(new Date(date));
          });
          self.$(".calendar").datepicker("setDates", holidays_of_month);
        }
      }, 100);
      self.$(".calendar").datepicker({
        multidate: true,
        multidateSeparator: '-',
        todayBtn: "linked",
        todayHighlight: true
      }).on("changeDate", function(ev) {
        var event_date = moment(ev.date).format("YYYY-MM-DD");
        var data = {};
        if(holidays_of_month.length > ev.dates.length) {
          holidays_of_month.forEach(function(date) {
            var date = new Date(date);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            if(ev.dates.indexOf(date) < 0) {
              data.onHoliday = false;
              data.date = moment(date).format("YYYY-MM-DD");
            }
          });
        } else {
          data.onHoliday = true;
          data.date = event_date;
        }
        Meteor.call("setLeave", Session.get("thisWorker")._id, data.date, data.onHoliday, function(err) {
          if(err) {
            return alert(err.reason);
          } else {
            var date = moment(data.date).format("YYYY-MM-DD");
            if(data.onHoliday) {
              if(holidays_of_month.indexOf(date) < 0) {
                holidays_of_month.push(date);
              }
            } else {
              if(holidays_of_month.indexOf(date) > 0) {
                holidays_of_month.splice(holidays_of_month.indexOf(date), 1);
              }
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