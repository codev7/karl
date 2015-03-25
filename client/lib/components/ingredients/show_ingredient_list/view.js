var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['code', 'description'];

var IngredientsSearch = new SearchSource('ingredients', fields, options);

Template.showIngredientsList.helpers({
  getIngredients: function() {
    return IngredientsSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {'code': 1}
    });
  },
  
  isLoading: function() {
    return IngredientsSearch.getStatus().loading;
  }
});

Template.showIngredientsList.events({
  "keyup #searchText-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    IngredientsSearch.search(text);
  }, 200),

  'submit form': function(event) {
    event.preventDefault();
    var ing_items = $(event.target).find("[name=selectedIng]").get();
    var ing_items_doc = [];
    ing_items.forEach(function(ing) {
      var dataid = $(ing).attr("data-id");
      var check = $(ing).is(':checked');
      if(dataid && check) {
        ing_items_doc.push(dataid);
      }
    });
    var alreadySelected = Session.get("selectedIngredients");
    if(alreadySelected && alreadySelected.length > 0) {
      ing_items_doc = ing_items_doc.concat(alreadySelected);  
    } 
    if(ing_items_doc.length > 0) {
      Session.set("selectedIngredients", ing_items_doc);
    } 
    $(event.target).find('[type=checkbox]').attr('checked', false);
    $("#searchText-box").val("");
    IngredientsSearch.search("");
    $("#ingredientsListModal").modal("hide");
  },

  'click #addNewIng': function(event) {
    console.log("-------");
    $("#addIngredientModal").modal('show');
    // $("")
  }
});

Template.showIngredientsList.rendered = function() {
  IngredientsSearch.search("");
}
