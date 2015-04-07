Template.textEditor.events({
  'focus .editor': function(event) {
    event.preventDefault();
    var text = $(event.target).text();
    if((text == "Add recipe here") || (text == "Add instructions here")) {
      $(event.target).empty();
    }
  },

  'click .editor-image-2': function(event) {
    $(".ql-image-tooltip").find('input').focusin(function() {
      filepicker.pickAndStore({mimetype:"image/*"}, {},
        function(InkBlobs) {
          var doc = (InkBlobs);
          if(doc) {
            $(".ql-image-tooltip").find('input').val(doc[0].url);
            $("#filepicker_dialog_container").find("a")[0].click();
          }
      });
    });
    
  }
});