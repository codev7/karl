Template.submitUnitCoversions.events({
  'click #submitUnit': function(event) {
    event.preventDefault();
    var unit = $("#unit").val();
    var convertTo = $("#convertTo").val();
    var count = $("#count").val();

    if(!unit || !unit.trim()) {
      return alert("Add Unit");
    } 
    if(!convertTo || !convertTo.trim()) {
      return alert("Add Conversion");
    } 
    if(!count || !count.trim()) {
      return alert("Add Count");
    } 
    Meteor.call("addUnitConvertion", unit, convertTo, count, function(err) {
      if(err) {
        return alert(err.reason);
      } else {
        $("#addUnitConversionModal").modal("hide");
      }
    });
  }
});