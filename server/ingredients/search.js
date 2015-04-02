SearchSource.defineSource('ingredients', function(searchText, options) {
  var optionFileds = {sort: {'code': 1}};
  var docs = [];
  var selector = {};
  if(options) {
    if(options.endingAt) {
      selector['$or'] = [
        {'code': {$gt: options.endingAt}},
        {'code': {$lte: options.endingAt}}
      ]
    }
    if(options.limit) {
      optionFileds['limit'] = options.limit;
    }
    if(options.ids) {
      selector['_id'] = {$nin: options.ids}
    }
  } else {
    optionFileds['limit'] = 10;
  }
  if(searchText) {
    var regExp = buildRegExp(searchText);
    selector['$or'] = [
      {'code': regExp},
      {'suppliers': regExp},
      {'description': regExp}
    ];
    docs = Ingredients.find(selector, optionFileds).fetch();
  } else {
    docs = Ingredients.find(selector, optionFileds).fetch();
  }
  return docs;
});

function buildRegExp(searchText) {
  return new RegExp(searchText, 'i');
}