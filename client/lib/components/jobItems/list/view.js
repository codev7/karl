Template.jobItemsList.events({
  'keyup #searchJobItemsBox': _.throttle(function(e) {
    var text = $(e.target).val().trim();
    FlowComponents.callAction('keyup', text);
  }, 200),

  'click #loadMoreJobItems': _.throttle(function(e) {
    e.preventDefault();
    FlowComponents.callAction('click');
  }, 200)
});

var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['code', 'description'];

IngredientsListSearch = new SearchSource('ingredients', fields, options);

Template.ingredientsList.helpers({
  getIngredients: function() {
    var data = IngredientsListSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {'code': 1}
    });
    console.log("...", data);
    return data;
  },
  
  isLoading: function() {
    return IngredientsListSearch.getStatus().loading;
  }
});

Template.ingredientsList.events({
  "keyup #searchJobItemsBox": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    IngredientsListSearch.search(text, {"limit": 10});
  }, 200),

  'click #loadMoreJobItems': _.throttle(function(e) {
    e.preventDefault();
    if(IngredientsListSearch.history) {
      if(IngredientsListSearch.history['']) {
        var dataHistory = IngredientsListSearch.history[''].data;
        if(dataHistory.length >= 9) {
          IngredientsListSearch.cleanHistory();
          var count = dataHistory.length;
          var lastItem = dataHistory[count - 1]['code'];
          var text = $("#searchIngBox").val().trim();
          IngredientsListSearch.search(text, {"limit": count + 10, "endingAt": lastItem});
        }
      }
    }
  }, 200)
});


Template.ingredientsList.rendered = function() {
  IngredientsListSearch.cleanHistory();
  IngredientsListSearch.search("", {"limit": 10});
}
