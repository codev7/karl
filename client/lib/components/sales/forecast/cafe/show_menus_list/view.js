Template.showMenusList.events({
  'submit form': function(event) {
    event.preventDefault();
    var menu_items = $(event.target).find("[name=selectedMenus]").get();
    var menu_items_doc = [];
    menu_items.forEach(function(item) {
      var id = $(item).attr("data-id");
      var check = $(item).is(':checked');
      if(id && check) {
        var obj = {
          "_id": id,
          "quantity": 0
        };
        menu_items_doc.push(obj);
      }
    });
    var day = Session.get("menuAddForForecast");
    if(day) {
      var forecast = ForecastCafe.findOne(day);
      if(forecast) {
        ForecastCafe.update({"_id": day}, {$set: {menus: menu_items_doc}});
      }
    }
    $("#showMenusList").modal("hide");
  }
});