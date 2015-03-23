SearchSource.defineSource('ingredients', function(searchText, options) {
  var optionFileds = {sort: {'code': 1}, limit: 50};
  var docs = [];
  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {'code': regExp},
      {'suppliers': regExp},
      {'description': regExp}
    ]};
    // console.log(".......", options);
    // if(options.endingAt) {
    //   if(options.sort > 0) {
    //     selector['code'] = {$gt: options.endingAt};
    //   } else {
    //     selector['code'] = {$lt: options.endingAt};
    //   }
    // }
    // console.log(".....selector", selector);
    docs = Ingredients.find(selector, optionFileds).fetch();
  } else {
    docs = Ingredients.find({}, optionFileds).fetch();
  }
  return docs;
});

function buildRegExp(searchText) {
  return new RegExp(searchText, 'i');
}