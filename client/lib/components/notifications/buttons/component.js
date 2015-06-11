var component = FlowComponents.define("notifiButtons", function(props) {
  this.notification = props.noti;
});

component.state.notifi = function() {
  return this.notification;
}

component.state.permittedActionType = function() {
  if(this.notification) {
    var type = this.notification.actionType;
    if(type && (type == "delete")) {
      return false;
    } else {
      return true;
    }
  }
}
