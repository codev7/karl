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
      return matchText.replace(regExp, "<b>$&</b>")
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
          alert("Menu item already added");
          $(".saleItem").focus();
        } else {
          console.log(err);
          return alert(err.reason);
        }
      } else {
        $('.saleItem').val("");
        $(".saleItem").focus();
        $(".saleQty").val("");
      }
    });
  } else if(name == "salesForecast") {
    Meteor.call("createSalesForecast", new Date(date), menuItemId, qty, function(err, id) {
      if(err) {
        if(err.reason == "Menu item already added") {
          alert("Menu item already added");
          $(".saleItem").focus();
        } else {
          console.log(err);
          return alert(err.reason);
        }
      } else {
        $('.saleItem').val("");
        $(".saleItem").focus();
        $(".saleQty").val("");
      }
    });
  }
}