var component = FlowComponents.define('textEditor', function(props) {
  this.initialHtml = props.initialHtml || "";
  this.onRendered(this.renderTextEditor);
});

component.prototype.renderTextEditor = function() {
  var editorContainer = this.find('.editor');
  var toolbarContainer = this.find('.toolbar');

  if(editorContainer && toolbarContainer) {
    this.editor = new Quill(editorContainer, {
      modules: {
        'toolbar': { container: toolbarContainer },
        'link-tooltip': true,
        'image-tooltip': true,
      },
      theme: 'snow',
      formats: ['bold', 'italic', 'strike', 'underline', 'link', 'bullet', 'list', 'image']
    });

    this.editor.setHTML(this.initialHtml);
  }
};

component.state.content = function() {
  return this.editor.getHTML();
}