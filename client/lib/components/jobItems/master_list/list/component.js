var component = FlowComponents.define('jobItemsList', function(props) {
  this.type = props.id;
  var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  };
  var fields = ['name'];

  this.JobItemsSearch = new SearchSource('jobItemsSearch', fields, options);
  this.onRendered(this.onJobListRendered);
});

component.state.type = function() {
  return this.type;
}

component.state.showSection = function() {
  var id = this.type;
  var type = JobTypes.findOne(id);
  if(type && type.name == "Recurring") {
    return true;
  } else {
    return false;
  }
}

component.action.keyup = function(text) {
  this.JobItemsSearch.search(text, {"type": this.type, limit: 10});
}

component.action.click = function() {
  var text = $("#searchJobItemsBox").val().trim();
  if(this.JobItemsSearch.history && this.JobItemsSearch.history[text]) {
    var dataHistory = this.JobItemsSearch.history[text].data;
    if(dataHistory.length >= 9) {
      this.JobItemsSearch.cleanHistory();
      var count = dataHistory.length;
      var lastItem = dataHistory[count - 1]['name'];
      this.JobItemsSearch.search(text, {"type": this.type, "limit": count + 10, "endingAt": lastItem});
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
  this.JobItemsSearch.search("", {"type": this.type, limit: 10});
}