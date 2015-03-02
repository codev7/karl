var server = meteor({flavor: "fiber"});
var client = browser({flavor: "fiber", location: server});

describe("Testing menu related methods", function() {
  describe("createMenuItem method", function() {
    it("without name", function() {
      var info = {
        "tag": "kids",
        "instructions": "Cook",
        "prepItems": [],
        "shelfLife": 20,
        "ingredients": [],
        "salesPrice": 30
      }
      var result = client.promise(function(done, error, info) {
        Meteor.call("createMenuItem", info, function(err, id) {
          if(err) {
            done(err);
          } else {
            done(id);
          }
        });
      }, [info]);
      expect(result.error).to.be.equal(404);
    });

    it("check insert", function() {
      var info = {
        "name": "Sa ndwit ch" + Math.random(),
        "tag": "kids",
        "instructions": "Cook",
        "prepItems": [],
        "shelfLife": 20,
        "ingredients": [],
        "salesPrice": 30
      }
      var id = info.name.trim().toLowerCase().replace(/ /g, "");
      var result = client.promise(function(done, error, info) {
        Meteor.call("createMenuItem", info, function(err, id) {
          if(err) {
            done(err);
          } else {
            done(id);
          }
        });
      }, [info]);
      expect(result).not.to.be.equal(null);

      var check = server.execute(function(id) {
        return MenuItems.findOne(id);
      }, [result]);
      expect(check._id).to.be.equal(id);
    });
  });

  describe("editMenuItem method", function() {
    it("check update", function() {
      var info = {
        "name": "Burger" + Math.random(),
        "tag": "Kids menu",
        "prepItems": ["1", "3"],
        "shelfLife": 123,
        "instructions": "Heat before serve",
        "ingredients": ["2", "3"],
        "salesPrice": 60
      }
      var id = server.execute(function(info) {
        return MenuItems.insert(info);
      }, [info]);
      expect(id).not.to.be.equal(null);

      var toUpdate = {
        "name": "Chicken Burger",
        "instructions": "Put in oven before serve"
      }
      var result = client.promise(function(done, error, id, info) {
        Meteor.call("editMenuItem", id, info, function(err) {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      }, [id, toUpdate]);
      expect(result).to.be.equal(null);

      var check = server.execute(function(id) {
        return MenuItems.findOne(id);
      }, [id]);
      expect(check.name).to.be.equal(toUpdate.name);
    });
  });

  describe("addIngredients method", function() {
    it("without menu item", function() {
      var menuItem = "1";
      var ingredients = [{"id": "1", "quantity": "10g"}];

      var result = client.promise(function(done, error, menuItem, ingredients) {
        Meteor.call("addIngredients", menuItem, ingredients, function(err) {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      }, [menuItem, ingredients]);
      expect(result.error).to.be.equal(404);
    });

    describe("with menu item", function() {
      it("without existing ingredients", function() {
        var info = {
          "name": "Burger" + Math.random(),
          "tag": "Kids menu",
          "prepItems": ["1", "3"],
          "shelfLife": 123,
          "instructions": "Heat before serve",
          "ingredients": [],
          "salesPrice": 60
        }
        var menuItem = server.execute(function(info) {
          return MenuItems.insert(info);
        }, [info]);
        expect(menuItem).to.be.not.equal(null);

        var ingredients = [
          {"id": 1, "quantity": '10g'},
          {"id": 2, "quantity": '100g'}
        ];

        var result = client.promise(function(done, error, menuItem, ingredients) {
          Meteor.call("addIngredients", menuItem, ingredients, function(err) {
            if(err) {
              done(err);
            } else {
              done();
            }
          });
        }, [menuItem, ingredients]);
        expect(result).to.be.equal(null);

        var check = server.execute(function(menuItem) {
          return MenuItems.findOne(menuItem);
        }, [menuItem]);
        expect(check.ingredients.length).to.be.equal(2);
      });

      it("with existing ingredients", function() {
        var info = {
          "name": "Burger" + Math.random(),
          "tag": "Kids menu",
          "prepItems": ["1", "3"],
          "shelfLife": 123,
          "instructions": "Heat before serve",
          "ingredients": [{"id": 1, "quantity": '10g'}],
          "salesPrice": 60
        }
        var menuItem = server.execute(function(info) {
          return MenuItems.insert(info);
        }, [info]);
        expect(menuItem).to.be.not.equal(null);

        var ingredients = [
          {"id": 2, "quantity": '100g'}
        ];

        var result = client.promise(function(done, error, menuItem, ingredients) {
          Meteor.call("addIngredients", menuItem, ingredients, function(err) {
            if(err) {
              done(err);
            } else {
              done();
            }
          });
        }, [menuItem, ingredients]);
        expect(result).to.be.equal(null);

        var check = server.execute(function(menuItem) {
          return MenuItems.findOne(menuItem);
        }, [menuItem]);
        expect(check.ingredients.length).to.be.equal(2);
      });


      it("with duplicated ingredients", function() {
        var info = {
          "name": "Burger" + Math.random(),
          "tag": "Kids menu",
          "prepItems": ["1", "3"],
          "shelfLife": 123,
          "instructions": "Heat before serve",
          "ingredients": [{"id": 1, "quantity": '10g'}, {"id": 2, "quantity": '10g'}],
          "salesPrice": 60
        }
        var menuItem = server.execute(function(info) {
          return MenuItems.insert(info);
        }, [info]);
        expect(menuItem).to.be.not.equal(null);

        var ingredients = [
          {"id": 2, "quantity": '100g'}
        ];
        
        var result = client.promise(function(done, error, menuItem, ingredients) {
          Meteor.call("addIngredients", menuItem, ingredients, function(err) {
            if(err) {
              done(err);
            } else {
              done();
            }
          });
        }, [menuItem, ingredients]);
        expect(result).to.be.equal(null);

        var check = server.execute(function(menuItem) {
          return MenuItems.findOne(menuItem);
        }, [menuItem]);
        expect(check.ingredients.length).to.be.equal(2);
      });
    });
  });
});