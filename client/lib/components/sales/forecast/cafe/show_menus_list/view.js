Template.showMenusList.events({
  'submit form': function(event) {
    event.preventDefault();
    var menu_items = $(event.target).find("[name=selectedMenus]").get();
    var id = Session.get("menuAddForForecast");
    if(id) {
      var forecast = ForecastCafe.findOne(id);
      if(forecast) {
        menu_items.forEach(function(item) {
          var menuId = $(item).attr("data-id");
          var check = $(item).is(':checked');
          if(menuId && check) {
            var obj = {
              "_id": menuId,
              "quantity": 0
            };
            Meteor.call("updateForcastedMenus", id, menuId, 0, function(err) {
              if(err) {
                console.log(err);
              }
            });
          }
        });
        
      }
    }
    $("#showMenusList").modal("hide");
  }
});