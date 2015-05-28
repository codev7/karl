var component = FlowComponents.define('textEditor', function(props) {
  this.initialHtml = props.initialHtml || "";
  this.onRendered(this.renderTextEditor);
});

component.prototype.renderTextEditor = function() {
  $('#summernote').summernote();

  $("#summernote").code(this.initialHtml);
};

component.state.content = function() {
  return $('#summernote').code();
}