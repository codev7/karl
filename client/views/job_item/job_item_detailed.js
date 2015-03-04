Template.jobItemDetailed.helpers({
  'cost': function() {
    var item = this;
    var cost = 0;
    if(item && item.ingredients) {
      if(item.ingredients.length > 0) {
        item.ingredients.forEach(function(doc) {
          console.log(doc);
          // console.log(item);
          if(doc.id) {
            var ing_doc = Ingredients.findOne(doc.id);
            console.log(ing_doc);
            
          }
          // cost += 
        });
      }
    }
  }
});