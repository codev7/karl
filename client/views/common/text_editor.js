TextEditor = function () {
  this.quill = null;
}

Template.textEditor.rendered = function() {
  // setTimeout(function() {
    this.data.quill = new Quill("#editor", {
      modules: {
        'toolbar': { container: '#toolbar' },
        'link-tooltip': true,
      },
      theme: 'snow',
      formats: ['bold', 'italic']
    });
    console.log(this.data.quill);
  // }, 100);
}