Template.profile.events({
  'change .shiftsPerWeek': function(event) {
    var id = $(event.target).attr("data-id");
    var value = $(event.target).val();
    Meteor.call("editBasicDetails", id, {"shiftsPerWeek": value}, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  }
});

Template.profile.rendered = function(){
  $.fn.editable.defaults.mode = 'inline';
  // Set options for peity charts
  $(".line").peity("line",{
      fill: '#1ab394',
      stroke:'#169c81'
  })

  $(".bar").peity("bar", {
      fill: ["#1ab394", "#d7d7d7"]
  })

  $('#datepicker').datepicker({
    todayBtn: true,
    todayHighlight: true
  });

  $('#username').editable({
    display: false,
    success: function(response, newValue) {
      if(newValue) {
        var id = $(this).data("pk");
        var editDetail = {"username": newValue};
        updateBasicDetails(id, editDetail, $('#username'), "username");
      }
    }
  });

  $('#phone').editable({
    display: false,
    success: function(response, newValue) {
      if(newValue) {
        var id = $(this).data("pk");
        var editDetail = {"phone": newValue};
        updateBasicDetails(id, editDetail, $('#phone'), "profile.phone");
      }
    }
  });

  $('#email').editable({
    display: false,
    success: function(response, newValue) {
      if(newValue) {
        var id = $(this).data("pk");
        var editDetail = {"email": newValue};
        updateBasicDetails(id, editDetail, $('#phone'), "profile.emails.address");
      }
    }
  });

  $('#weekdaysrate').editable({
    display: false,
    success: function(response, newValue) {
      if(newValue) {
        var id = $(this).data("pk");
        var newRate = parseFloat(newValue);
        if(newRate && (newRate == newRate)) {
          newRate = newRate
        } else {
          newRate = 0;
        }
        var editDetail = {"weekdaysrate": newRate};
        updateBasicDetails(id, editDetail, $('#weekdaysrate'), "profile.payrates.weekdays");
      }
    }
  });

  $('#saturdayrate').editable({
    display: false,
    success: function(response, newValue) {
      if(newValue) {
        var id = $(this).data("pk");
        var newRate = parseFloat(newValue);
        if(newRate && (newRate == newRate)) {
          newRate = newRate
        } else {
          newRate = 0;
        }
        var editDetail = {"saturdayrate": newRate};
        updateBasicDetails(id, editDetail, $('#saturdayrate'), "profile.payrates.saturday");
      }
    }
  });

  $('#sundayrate').editable({
    display: false,
    success: function(response, newValue) {
      if(newValue) {
        var id = $(this).data("pk");
        var newRate = parseFloat(newValue);
        if(newRate && (newRate == newRate)) {
          newRate = newRate
        } else {
          newRate = 0;
        }
        var editDetail = {"sundayrate": newRate};
        updateBasicDetails(id, editDetail, $('#sundayrate'), "profile.payrates.sunday");
      }
    }
  });

};

function updateBasicDetails(id, updateDetails, element, type) {
  Meteor.call("editBasicDetails", id, updateDetails, function(err) {
    if(err) {
      console.log(err);
      var user = Meteor.users.findOne(id);
      if(user) {
        $(element).editable('setValue', user[type]);
      } else {
        $(element).editable('setValue', null);
      }
      return alert(err.reason);
    }
  });
}