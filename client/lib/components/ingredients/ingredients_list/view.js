var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['code', 'description'];

var IngredientsListSearch = new SearchSource('ingredients', fields, options);

Template.ingredientsList.helpers({
  getIngredients: function() {
    return IngredientsListSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {'code': 1}
    });
  },
  
  isLoading: function() {
    return IngredientsListSearch.getStatus().loading;
  }
});

Template.ingredientsList.events({
  "keyup #searchIngBox": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    IngredientsListSearch.search(text);
  }, 200),

  'scroll #list': function(event) {
    console.log("--------");
  }
});


Template.ingredientsList.rendered = function() {
  IngredientsListSearch.cleanHistory();
  IngredientsListSearch.search("");
}
