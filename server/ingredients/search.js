SearchSource.defineSource('ingredients', function(searchText, options) {
  var options = {sort: {'code': 1}, limit: 10};
  var docs = [];
  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {'code': regExp},
      {'description': regExp}
    ]};

    docs = Ingredients.find(selector, options).fetch();
  } else {
    docs = Ingredients.find({}, options).fetch();
  }
  return docs;
});

function buildRegExp(searchText) {
  return new RegExp(searchText, 'i');
}