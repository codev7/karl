var subs = new SubsManager();

var component = FlowComponents.define('jobItemDetailed', function(props) {
  this.jobitem = props.jobitem;
  var ids = [];
  if(this.jobitem.ingredients && this.jobitem.ingredients.length > 0) {
    this.jobitem.ingredients.forEach(function(ing) {
      ids.push(ing._id);
    });
    if(ids.length > 0) {
      subs.subscribe("ingredients", ids);
    }
  }
});

component.state.job = function() {
  return this.jobitem;
}

component.state.cost = function() {
  var totalCost = 0;
  var costPerPortion = 0;
  var labourCost = 0;
  if(this.jobitem && this.jobitem.ingredients) {
    var ings = this.jobitem.ingredients;
    if(ings.length > 0) {
      ings.forEach(function(ing) {
        var ingre = Ingredients.findOne(ing._id);
        if(ingre) {
          totalCost += (ingre.costPerPortion/ingre.unitSize) * ing.quantity;
        }
      });
    }
    if(this.jobitem.activeTime > 0 && this.jobitem.wagePerHour) {
      labourCost = (this.jobitem.wagePerHour/60) * (this.jobitem.activeTime/60);
    }
    if(this.jobitem.portions > 0) {
      costPerPortion = (totalCost + labourCost)/this.jobitem.portions;
      costPerPortion = Math.round(costPerPortion * 100)/100;
      if(costPerPortion == costPerPortion) {
        return costPerPortion;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}
