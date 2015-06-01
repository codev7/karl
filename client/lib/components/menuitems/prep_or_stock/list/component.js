var component = FlowComponents.define("showListOfIngs", function(props) {
  this.onRendered(this.renderList);
  var id = Router.current().params._id;
  this.item = MenuItems.findOne(id);

  var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  };
  var fieldsPrep = ['name'];
  this.JobItemsSearch = new SearchSource('jobItemsSearch', fieldsPrep, options);

  var fieldsIng = ['code', 'description'];
  this.IngredientsSearch = new SearchSource('ingredients', fieldsIng, options);
});

component.prototype.setJobIds = function() {
  var ids = [];
  if(this.item && this.item.jobItems) {
    if(this.item.jobItems.length > 0) {
      this.item.jobItems.forEach(function(doc) {
        ids.push(doc._id);
      });
    }
  }

  this.set("jobids", ids);
  return ids;
}

component.prototype.setIngIds = function() {
  var ids = [];

  if(this.item && this.item.ingredients) {
    if(this.item.ingredients.length > 0) {
      this.item.ingredients.forEach(function(doc) {
        ids.push(doc._id);
      });
    }
  }
  this.set("ingids", ids);
  return ids;
}

component.prototype.renderList = function() {
  var jobids = this.setJobIds();
  this.JobItemsSearch.search("",{"ids": jobids, "type": "Prep", "limit": 10});

  var ingids = this.setIngIds();
  this.IngredientsSearch.search("", {"ids": ingids});
  
};

component.action.keyup = function(text) {
  var ingids = this.setIngIds();
  this.IngredientsSearch.search(text, {"ids": ingids});

  var jobids = this.setJobIds();
  this.JobItemsSearch.search(text, {"ids": jobids, "type": "Prep", "limit": 10});
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

component.state.getIngredients = function() {
  return this.IngredientsSearch.getData({
    transform: function(matchText, regExp) {
      return matchText.replace(regExp, "<b>$&</b>")
    },
    sort: {'code': 1}
  });
}
