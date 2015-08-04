Template.jobFlyout.events({
  'click .removeAssignedJob': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Meteor.call("assignJob", id, null, null, function(err) {
      if(err) {
        console.log(err);
      }
      $(".flyout-container").toggleClass("show");
    });
  },

  'click .theme-config-close-btn': function(event) {
    $(".flyout-container").removeClass("show");
  },

  'click .checklist-check input': function(event) {
    var checked = $(event.target).is(":checked");
    checked ? $(event.target).closest('.checklist-check').addClass('checked') : $(event.target).closest('.checklist-check').removeClass('checked')
  }
});

Template.jobFlyout.rendered = function() {

  $('html').click(function (event) {
    var flyout = $(".flyout-container");
    if (!flyout.is(event.target) && flyout.has(event.target).length === 0){
      flyout.removeClass('show');
    }
  });
}