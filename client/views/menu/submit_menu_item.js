Template.submitMenuItem.events({
  'click .addjob': function(e, instance) {
    e.preventDefault();
    var htmlInput = "<input type='text' name='jobItems' class='form-control'/> <br/>"
    $(".jobItemsList").append(htmlInput)
  },

  'click #addPrepItem': function(e, instance) {
    e.preventDefault();
    console.log("-----------");
  },

  'submit form': function(e, instance) {
    e.preventDefault();
    var name = $(event.target).find('[name=name]').val().trim(); 
    var tag = $(event.target).find('[name=tag]').val().trim(); 
    var shelfLife = $(event.target).find('[name=shelfLife]').val().trim(); 
    var instructions = $(event.target).find('[name=instructions]').val().trim(); 
    var prepItems = [];
    var ingredients = [];
    var salesPrice = $(event.target).find('[name=salesPrice]').val().trim(); 
    var image = [];

    var info = {
      "name": name,
      "tag": tag,
      "instructions": instructions,
      "shelfLife": shelfLife,
      "prepItems": prepItems,
      "ingredients": ingredients,
      "salesPrice": salesPrice,
      "image": image
    }
    Meteor.call("createMenuItem", info, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
    Router.go("menuMaster");
  }
});