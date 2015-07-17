var component = FlowComponents.define('jobItemsList', function(props) {
  var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  };
  var fields = ['name'];

  this.JobItemsSearch = new SearchSource('jobItemsSearch', fields, options);
  this.onRendered(this.onJobListRendered);
});

component.action.keyup = function(text) {
  this.JobItemsSearch.search(text, {limit: 10});
}

component.action.click = function() {
  var text = $("#searchJobItemsBox").val().trim();
  if(this.JobItemsSearch.history && this.JobItemsSearch.history[text]) {
    var dataHistory = this.JobItemsSearch.history[text].data;
    if(dataHistory.length >= 9) {
      this.JobItemsSearch.cleanHistory();
      var count = dataHistory.length;
      var lastItem = dataHistory[count - 1]['name'];
      this.JobItemsSearch.search(text, {"limit": count + 10, "endingAt": lastItem});
    }
  }
}

component.state.getJobItems = function() {
  var data = this.JobItemsSearch.getData({
    transform: function(matchText, regExp) {
      return matchText.replace(regExp, "<b>$&</b>")
    },
    sort: {'name': 1}
  });
  return data;
}

component.prototype.onJobListRendered = function() {
  this.JobItemsSearch.search("", {limit: 10});
}