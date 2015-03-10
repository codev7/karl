var server = meteor({flavor: "fiber"});
var client = browser({flavor: "fiber", location: server});

describe("Testing menu methods", function() {
  describe("createMenu method", function() {
    it("with name", function() {
      var name = "Today's Special";
      var menuItems = ["1", "2"];

      var menuId = client.promise(function(done, error, name, menuItems) {
        Meteor.call("createMenu", name, menuItems, function(err, id) {
          if(err) {
            done(err);
          } else {
            done(id);
          }
        });
      }, [name, menuItems]);
      expect(menuId).not.to.be.equal(null);
    });

    it("without name", function() {
      var name = null;
      var menuItems = ["1", "2"];

      var menuId = client.promise(function(done, error, name, menuItems) {
        Meteor.call("createMenu", name, menuItems, function(err, id) {
          if(err) {
            done(err);
          } else {
            done(id);
          }
        });
      }, [name, menuItems]);
      expect(menuId).not.to.be.equal(null);

       var menuId1 = client.promise(function(done, error, name, menuItems) {
        Meteor.call("createMenu", name, menuItems, function(err, id) {
          if(err) {
            done(err);
          } else {
            done(id);
          }
        });
      }, [name, menuItems]);
      expect(menuId1).not.to.be.equal(null);

      var check = server.execute(function(id) {
        return Menus.findOne(id);
      }, [menuId]);
      expect(check.name).not.to.be.equal(null);
    });

    it("without menu items", function() {
      
    });
  });
});