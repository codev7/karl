var component = FlowComponents.define("stockCountingListItem", function(props) {
  this.id = props.id;
  this.date = props.date;
  this.garea = props.garea;
  this.sarea = props.sarea;
  this.onRendered(this.onItemRendered);
});

component.state.item = function() {
  var stock = Ingredients.findOne(this.id);
  var stocktake = Stocktakes.findOne({
    "date": this.date, 
    "stockId": this.id, 
    "generalArea": this.garea,
    "specialArea": this.sarea
  });
  if(stock) {
    if(stocktake) {
      stock['stockRef'] = stocktake._id;
      stock['counting'] = stocktake.counting;
    } else {
      stock['stockRef'] = null;
      stock['counting'] = 0;
    }
    return stock;
  }
}

component.state.ordering = function() {
  var item = CurrentStocks.findOne(this.id);
  if(item) {
    console.log("..........................", item)
    return item;
  }
}

component.prototype.onItemRendered = function() {
  $(".counting").editable({
    type: "text",
    title: 'Edit No of Portions',
    showbuttons: true,
    display: false,
    mode: 'inline',
    success: function(response, newValue) {
      var id = $(this).closest("li").attr("data-id");
      var date = Session.get("thisDate");
      if(newValue) {
        var info = {
          "date": date,
          "generalArea": Session.get("activeGArea"),
          "specialArea": Session.get("activeSArea"),
          "stockId": id,
          "counting": parseFloat(newValue)
        }
        Meteor.call("updateStocktake", info, function(err, id) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });
      }
    }
  });
}