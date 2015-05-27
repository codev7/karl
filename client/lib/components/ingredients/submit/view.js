Template.submitIngredient.events({
  'submit form': function(event) {
    event.preventDefault();
    var code = $(event.target).find('[name=code]').val().trim();
    var desc = $(event.target).find('[name=desc]').val().trim();
    var supplier = $(event.target).find('[name=supplier]').val().trim();
    var portionOrdered = $(event.target).find('[name=portionOrdered]').val().trim();
    var costPerPortion = $(event.target).find('[name=costPerPortion]').val();
    var portionUsed = $(event.target).find('[name=portionUsed]').val().trim();
    var unitSize = $(event.target).find('[name=unitSize]').val().trim();

    if(!code) {
      return alert("You need to add a code");
    }
    if(!desc) {
      return alert("You need to a description");
    }
    var info = {
      "code": code,
      "description": desc,
      "portionOrdered": portionOrdered,
      "portionUsed": portionUsed,
      "suppliers": []
    }

    if(!costPerPortion || typeof(parseFloat(costPerPortion)) != "number") {
      info.costPerPortion =  0;
    } else {
      info.costPerPortion = parseFloat(costPerPortion);
      info.costPerPortion = Math.round(info.costPerPortion * 100)/100;
    }
    if(!unitSize || typeof(parseFloat(unitSize)) != "number") {
      info.unitSize =  0;
    } else {
      info.unitSize = parseFloat(unitSize);
    }

    if(supplier.length) {
      info.suppliers.push(supplier);
    }
    FlowComponents.callAction('submit', event, info);
  }
});