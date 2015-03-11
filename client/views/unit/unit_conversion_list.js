Template.unitConversionList.helpers({
  'items': function() {
    var units = Conversions.find().fetch();
    return units;
  }
});