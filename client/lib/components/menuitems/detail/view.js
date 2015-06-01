Template.menuItemDetail.events({
  'click .textEdit': function(event) {
    event.preventDefault();
    $(".editorPanel").hide();
    $(".editor").removeClass("hide");
    $(event.target).text("Click here to save").removeClass("textEdit").addClass("saveText");
  },

  'click .saveText': function(event) {
    event.preventDefault();
    var menuId = Session.get("thisMenuItem");
    var text = FlowComponents.child('menuItemEditorDetail').getState('content');
    var info = {};
    info.instructions = text;
    Meteor.call("editMenuItem", menuId, info, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        var menu = MenuItems.findOne(menuId);
        var options = {
          "type": "edit",
          "title": "Instructions on " + menu.name + " has been updated",
          "text": text
        }
        Meteor.call("sendNotifications", menuId, "menu", options, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });   
         
      }
      $(".editor").addClass("hide");
      $(".editorPanel").show().find("p").replaceWith(text);
      $(event.target).text("Click here to edit").removeClass("saveText").addClass("textEdit");
    })
  }
});