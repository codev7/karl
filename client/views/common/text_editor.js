TextEditor = function () {
  this.quill = null;
}

Template.textEditor.rendered = function() {
  // setTimeout(function() {
    // this.data.quill = new Quill("#editor", {
    //   modules: {
    //     'toolbar': { container: '#toolbar' },
    //     'link-tooltip': true,
    //   },
    //   theme: 'snow',
    //   formats: ['bold', 'italic']
    // });
    // console.log(this.data.quill);
  // }, 100);


  var self = this;
  setTimeout(function() {
    var editorContainer = self.find('#editor');
    var toolbarContainer = self.find('#toolbar');

    var editor = window.editor = new Quill(editorContainer, {
      modules: {
        'toolbar': { container: toolbarContainer },
        'link-tooltip': true,
        'image-tooltip': true,
      },
      theme: 'snow',
      formats: ['bold', 'italic', 'strike', 'underline', 'link', 'bullet', 'list', 'image']
    });
  }, 100);
}