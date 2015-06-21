var component = FlowComponents.define('textEditor', function(props) {
  this.initialHtml = props.initialHtml || "";
  this.onRendered(this.renderTextEditor);
});

component.prototype.renderTextEditor = function() {
  $('.summernote').summernote({
    focus: false,
    toolbar: [['style', ['bold', 'italic', 'underline', 'clear']],
              ['fontsize', ['fontsize']],
              ['para', ['ul', 'ol', 'paragraph']],
              ['height', ['height']],
              ['view', ['fullscreen', 'codeview']],
              ['table', ['table']],
              ['insert', ['link']]
    ],
    oninit: function() {
      // Add "open" - "save" buttons
      var imageButton = '<button id="uploadImage" type="button" class="btn btn-default btn-sm btn-small" title="Upload an image" data-event="something" tabindex="-1"><i class="fa fa-picture-o icon-picture"></i></button>';            
      var fileGroup = '<div class="note-insert btn-group">' + imageButton + '</div>';
      $(imageButton).appendTo($('.note-insert')[1]);
      // Button tooltips
      $('#uploadImage').tooltip({container: 'body', placement: 'bottom'});
      // Button events
      $('#uploadImage').click(function(event) {
        filepicker.pickAndStore({mimetype:"image/*"}, {},
          function(InkBlobs){
            var doc = (InkBlobs);
            if(doc && doc[0].url) {
              var image = "<img src='" + doc[0].url + "' alt='uploaded image'>";
              if(image) {
                $(image).appendTo($(".note-editable"));
              }
            }
        });
      });
    }
  });
  $(".summernote").code(this.initialHtml);
};

component.state.content = function() {
  return $('.summernote').code();
}