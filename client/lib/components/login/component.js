var component = FlowComponents.define('signIn', function(props) {
  this.onRendered(this.renderModal)
});

component.prototype.renderModal = function() {
  if($("#at-google").length > 0) {
    $("#at-google").attr("data-toggle", "modal");
  }
}