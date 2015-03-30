var component = FlowComponents.define('layout', function(props) {
  this.route = Router.current().route.getName();
  console.log(this);
});

component.state.name = function() {
  console.log(this);
  return "nadee"
}