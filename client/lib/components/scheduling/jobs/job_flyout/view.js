Template.jobFlyout.events({
  'click .removeAssignedJob': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Meteor.call("assignJob", id, null, null, function(err) {
      if(err) {
        console.log(err);
      }
      $(".theme-config-box").toggleClass("show");
      setTimeout(function() {
        $(".flyout-container").css("z-index", -1);
      }, 1000);
    });
  },

  'click .theme-config-close-btn': function(evt) {
    $(".theme-config-box").removeClass("show");
    setTimeout(function() {
      $(".flyout-container").css("z-index", -1);
    }, 1000);
  },

  'click .checklist-check input': function(event) {
   var checked = $(event.target).is(":checked");
   checked ? $(event.target).closest('.checklist-check').addClass('checked') : $(event.target).closest('.checklist-check').removeClass('checked')
  }
});

Template.jobFlyout.rendered = function() {
  // $('.i-checks').iCheck({
  //   checkboxClass: 'icheckbox_square-green',
  //   radioClass: 'iradio_square-green'
  // });
  // $('input').on('ifChecked', function(event){
  //   $(this).closest('.i-checks').addClass('checked');
  // });
  // $('input').on('ifUnchecked', function(event){
  //   $(this).closest('.i-checks').removeClass('checked');
  // });
}