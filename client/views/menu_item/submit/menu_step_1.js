Template.menuStep1Submit.events({
  'submit form': function(e, instance) {
    e.preventDefault();
    var name = $(event.target).find('[name=name]').val().trim(); 
    var tag = $(event.target).find('[name=tag]').val().trim(); 
    // var shelfLife = $(event.target).find('[name=shelfLife]').val().trim(); 
    var instructions = $(event.target).find('[name=instructions]').val().trim(); 
    var prepItems = [];
    var ingredients = [];
    var salesPrice = $(event.target).find('[name=salesPrice]').val().trim(); 
    var image = [];

    // var onShelf = parseInt(shelfLife)*24*60*60;
    if(typeof(parseInt(salesPrice)) != 'number') {
      salesPrice = 0;
    }
    var info = {
      "name": name,
      "tag": tag,
      "instructions": instructions,
      // "shelfLife": onShelf,
      "prepItems": prepItems,
      "ingredients": ingredients,
      "salesPrice": parseFloat(salesPrice),
      "image": image
    }
    Meteor.call("createMenuItem", info, function(err, id) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
      Session.set("selectedIngredients", []);
      Session.set("selectedJobItems", []);
      Router.go("menuItemSubmitStep2", {"_id": id});
    });
  }
});