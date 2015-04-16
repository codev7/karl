SearchSource.defineSource('menuItems', function(searchText, options) {
  var optionFileds = {sort: {'name': 1}};
  var docs = [];
  var selector = {};
  if(options) {
    if(options.endingAt) {
      selector['$or'] = [
        {'name': {$gt: options.endingAt}},
        {'name': {$lte: options.endingAt}}
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
  optionFileds.fields = {"name": 1, "category": 1, "salesPrice": 1, "status": 1}
  if(searchText) {
    var regExp = buildRegExp(searchText);
    selector['$or'] = [
      {'name': regExp}
    ];
    docs = MenuItems.find(selector, optionFileds).fetch();
  } else {
    docs = MenuItems.find(selector, optionFileds).fetch();
  }
  return docs;
});

function buildRegExp(searchText) {
  return new RegExp(searchText, 'i');
}