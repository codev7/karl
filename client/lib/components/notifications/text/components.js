var component = FlowComponents.define("notifiText", function(props) {
  this.notification = props.noti;
});

component.state.notifi = function() {
  if(this.notification) {
    return this.notification;
  }
}


component.state.icon = function() {
  if(this.notification) {
    var type = this.notification.type;
    if(type == "job") {
      return "spoon";
    } else if(type == "menu") {
      return "cutlery";
    } else if(type == "comment") {
      return "comment";
    } else if (type == "roster") {
      return "calendar-o"
    }
  }
}
