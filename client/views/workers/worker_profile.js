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
  $("#calendar").datepicker({
    multidate: true,
    multidateSeparator: '-',
    todayBtn: "linked",
    todayHighlight: true
  }).on("changeDate", function(ev) {
    var date = moment(ev.date).format("YYYY-MM-DD");;
    var workerId = $(".deleteWorker").attr("data-id");
    var onHoliday = true;
    var holiday = Holidays.findOne({"date": date});
    if(holiday) {
      if(holiday.workers.indexOf(workerId)) {
        onHoliday = false;
      }
    }
    console.log("-----", date, workerId, onHoliday, holiday);
    Meteor.call("setLeave", workerId, date, onHoliday, function(err) {
      if(err) {
        return alert(err.reason);
      }
    });

  }).on("changeMonth", function(ev) {
    console.log(ev);
  });


  // $('#calendar').datepicker('setDates', [new Date('2015-4-5'), new Date('2015-4-10')]);
  // .on('changeDate', function(ev){
  //   console.log(ev);
  //   var date = moment(ev.date).format("YYYY-MM-DD");
  //   var workerId = $(".deleteWorker").attr("data-id");
  //   var onHoliday = true;
  //   var holiday = Holidays.findOne({"date": date});
  //   if(holiday) {
  //     if(holiday.workers.indexOf(workerId)) {
  //       onHoliday = false;
  //     }
  //   }
  //   console.log("-----", date, workerId, onHoliday, holiday);
  //   // Meteor.call("setLeave", workerId, date, onHoliday, function(err) {
  //   //   if(err) {
  //   //     return alert(err.reason);
  //   //   }
  //   // });
  // });
}