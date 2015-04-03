var component = FlowComponents.define('showJobItemsList', function(props) {
  this.onRendered(this.onJobLitsRendered);
  var id = Router.current().params._id;

  var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  };
  var fields = ['name'];

  this.JobItemsSearch = new SearchSource('jobItemsSearch', fields, options);

  if(props.name) {
    if(props.name == "editMenu") {
      this.item = MenuItems.findOne(id);
    }
  }
});

component.prototype.onJobLitsRendered = function() {
  var ids = this.setIds();
  this.JobItemsSearch.search("",{"ids": ids, "limit": 10});
}

component.action.keyup = function(text) {
  var ids = this.setIds();
  this.JobItemsSearch.search(text, {"ids": ids, "limit": 10});
}

component.prototype.setIds = function() {
  var ids = [];
  if(this.item) {
    if(this.item.jobItems.length > 0) {
      this.item.jobItems.forEach(function(doc) {
        ids.push(doc._id);
      });
    }
  }
  this.set("ids", ids);
  return ids;
}

component.state.getJobItemsa = function() {
  var data = this.JobItemsSearch.getData({
    transform: function(matchText, regExp) {
      return matchText.replace(regExp, "<b>$&</b>")
    },
    sort: {'name': 1}
  });
  return data;
}

component.action.submit = function() {
  this.JobItemsSearch.search("");
}
