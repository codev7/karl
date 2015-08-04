var component = FlowComponents.define("supplierFilter", function(props) {});

component.state.suppliers = function() {
  var ordersList = OrdersPlaced.find({
    "stocktakeDate": Session.get("thisDate")
  });
  var supplierslist = [];
  ordersList.forEach(function(order) {
    if(order.supplier) {
      if(supplierslist.indexOf(order.supplier) < 0) {
        supplierslist.push(order.supplier);
      }
    }
  });
  Session.set("activeSupplier", supplierslist[0])
  return supplierslist;
}

component.state.activeSupplier = function() {
  return Session.get("activeSupplier");
}

component.state.thisSupplierActive = function(id) {
  var active = Session.get("activeSupplier");
  if(active == id) {
    return true;
  } else {
    return false;
  }
}

component.state.orderViaEmail = function() {
  var list = OrdersPlaced.find({
    "stocktakeDate": Session.get("thisDate"), 
    "orderedThrough": "email", 
    "supplier": Session.get("activeSupplier")
  });
  if(list && list.length > 0) {
    return true;
  } else {
    return false;
  }
}

component.state.orderViaPhone = function() {
 var list = OrdersPlaced.find({
  "stocktakeDate": Session.get("thisDate"), 
  "orderedThrough": "phone", 
  "supplier": Session.get("activeSupplier")
});
  if(list && list.length > 0) {
    return true;
  } else {
    return false;
  }
}

component.state.deliveryDate = function() {
  var list = OrdersPlaced.find({
    "stocktakeDate": Session.get("thisDate"), 
    "orderedThrough": {$exists: true}, 
    "deliveryDate": {$exists: true},
    "supplier": Session.get("activeSupplier")
  });
  if(list && list.length > 0) {
    return list[0].deliveryDate
  }
}