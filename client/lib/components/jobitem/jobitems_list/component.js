var component = FlowComponents.define('jobItemsList', function(props) {
  this.onRendered(this.onJobLitsRendered);
  var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  };
  var fields = ['name'];

  this.JobItemsSearch = new SearchSource('jobItems', fields, options);
});

component.action.keyup = function(text) {
  this.JobItemsSearch.search(text);
}

component.action.click = function() {
  if(this.JobItemsSearch.history) {
    if(this.JobItemsSearch.history['']) {
      var dataHistory = this.JobItemsSearch.history[''].data;
      if(dataHistory.length >= 9) {
        this.JobItemsSearch.cleanHistory();
        var count = dataHistory.length;
        var lastItem = dataHistory[count - 1]['code'];
        var text = $("#searchJobItemsBox").val().trim();
        this.JobItemsSearch.search(text, {"limit": count + 10, "endingAt": lastItem});
      }
    }
  }
}

component.state.getJobItems = function() {
  return this.JobItemsSearch.getData({
    transform: function(matchText, regExp) {
      return matchText.replace(regExp, "<b>$&</b>")
    },
    sort: {'name': 1}
  });
}

component.prototype.onJobLitsRendered = function() {
  this.JobItemsSearch.search("");
}