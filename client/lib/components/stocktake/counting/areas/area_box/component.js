var component = FlowComponents.define("areaBox", function(props) {
  this.item = props.item;
  this.class = props.class;
  this.name = props.name;
  this.onRendered(this.onItemRendered);
});

component.state.item = function() {
  var area = this.item;
  area.class = this.class;
  area.type = this.name;
  return area;
}

component.state.widthofBar = function() {
  if(this.class == "sarea-filter") {
    // if(this.item.)
    return '50%';
  } else if(this.class == "garea-filter") {
    return '70%';
  }
}

component.prototype.onItemRendered = function() {
  $(".sarea").editable({
    type: "text",
    title: 'Edit Special area name',
    showbuttons: false,
    mode: 'inline',
    success: function(response, newValue) {
      var self = this;
      var id = $(self).parent().attr("data-id");
      if(newValue) {
        Meteor.call("editSpecialArea", id, {"name": newValue}, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });
      }
    }
  });

  $(".garea").editable({
    type: "text",
    title: 'Edit General area name',
    showbuttons: false,
    mode: 'inline',
    success: function(response, newValue) {
      var self = this;
      var id = $(self).parent().attr("data-id");
      if(newValue) {
        Meteor.call("editGeneralArea", id, {"name": newValue}, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });
      }
    }
  });
};