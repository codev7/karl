var component = FlowComponents.define("menuDetailWidgets", function(props) {
  this.item = props.item;
});

component.state.item = function() {
  var menu = this.item;
  menu['totalIngCost'] = 0;
  menu['totalPrepCost'] = 0;
  menu['tax'] = (menu.salesPrice * (10/100));
  menu['contribution'] = 0;
  if(menu.ingredients.length > 0) {
    menu.ingredients.forEach(function(item) {
      var ing = getIngredientItem(item._id);
      if(ing) {
        menu.totalIngCost += (ing.costPerPortionUsed * item.quantity);
      }
    })
  }

  if(menu.jobItems.length > 0) {
    menu.jobItems.forEach(function(item) {
      var prep = getPrepItem(item._id);
      if(prep) {
        menu.totalPrepCost += (prep.prepCostPerPortion * item.quantity);
      }
    });
  }
  menu.tax = Math.round(menu.tax * 100)/100;
  menu.totalIngCost = Math.round(menu.totalIngCost * 100)/100;
  menu.totalPrepCost = Math.round(menu.totalPrepCost * 100)/100;
  menu.contribution = menu.salesPrice -(menu.totalPrepCost + menu.totalIngCost + menu.tax);
  menu.contribution = Math.round(menu.contribution * 100)/100;
  return menu;
}