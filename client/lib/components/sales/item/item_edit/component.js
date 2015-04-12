var component = FlowComponents.define("editSalesItem", function(props) {
  this.set("name", props.name);

  this.onRendered(this.onMenuListRendered);
  var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  };
  var fields = ['name'];

  this.MenuItemsSearch = new SearchSource('menuItems', fields, options);
});

component.action.keyup = function(text) {
  this.MenuItemsSearch.search(text);
}

component.state.getMenuItems = function() {
  var doc = this.MenuItemsSearch.getData({
    transform: function(matchText, regExp) {
      return matchText;
    },
    sort: {'name': 1}
  });
  return doc;
}

component.prototype.onMenuListRendered = function() {
  this.MenuItemsSearch.search("");
}

component.action.submit = function(date, menuItemId, qty) {
  var name = this.get("name");
  if(name == "actualSales") {
    Meteor.call("createSalesMenus", new Date(date), menuItemId, qty, function(err, id) {
      if(err) {
        if(err.reason == "Menu item already added") {
          alert("Menu item has already been added");
          $(".custom-combobox-input").focus();
        } else {
          console.log(err);
          return alert(err.reason);
        }
      } else {
        $('.custom-combobox-input').val("");
        $(".custom-combobox-input").focus();
        $(".saleQty").val("");
      }
    });
  } else if(name == "salesForecast") {
    Meteor.call("createSalesForecast", new Date(date), menuItemId, qty, function(err, id) {
      if(err) {
        if(err.reason == "Menu item already added") {
          alert("Menu item already added");
          $(".custom-combobox-input").focus();
        } else {
          console.log(err);
          return alert(err.reason);
        }
      } else {
        $('.custom-combobox-input').val("");
        $(".custom-combobox-input").focus();
        $(".saleQty").val("");
      }
    });
  }
}