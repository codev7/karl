Template.weeklyForecastedMenus.events({
  'click .generateJobs': function(event) {
    var forecast = ForecastCafe.find().fetch();
    var menus = [];
    var menuIds = [];
    forecast.forEach(function(day) {
      if(day.menus && day.menus.length > 0) {
        var selected = day.menus;
        selected.forEach(function(doc) {

          if(menuIds.indexOf(doc._id) >= 0) {
            var index = menuIds.indexOf(doc._id);
            var item = menus[index];
            item.quantity += parseInt(doc.quantity);
          } else {
            var obj = {
              "id": doc._id,
              "quantity": parseInt(doc.quantity)
            }
            menus.push(obj);
          }
          if(menuIds.indexOf(doc._id) < 0) {
            menuIds.push(doc._id);
          }
        });
      } 
    });
    Meteor.call("generateJobs", menus, new Date(), function(err, result) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        Router.go("/jobs")
      }
    });
  }
});