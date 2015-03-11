var server = meteor({flavor: "fiber"});
var client = browser({flavor: "fiber", location: server});

describe("Testing ingredients related methods", function() {
  describe("createIngredients method", function() {
    it("with one supplier", function() {
      var info = {
        "code": "VV Eggs",
        "description": "Eggs box",
        "suppliers": ["Villa"],
        "portionOrdered": "box",
        "unitSize": 180,
        "costPerPortion": 60,
        "portionUsed": 1
      }

      var result = client.promise(function(done, error, info) {
        Meteor.call("createIngredients", info, function(err, id) {
          if(err) {
            done(err);
          } else {
            done(id);
          }
        });
      }, [info]);
      expect(result).not.to.be.equal(null);

      var check = server.execute(function(id) {
        var doc = Ingredients.findOne(id);
        return doc;
      }, [result]);
      // console.log(check);
      expect(check._id).to.be.equal(result);
    });

    it("with few suppliers", function() {
      var info = {
        "code": "VV Eggs",
        "description": "Eggs box",
        "suppliers": ["Villa", "Bella"],
        "portionOrdered": "box",
        "costPerPortion": 60,
        "portionUsed": 1,
        "unitSize": 180,
      }

      var result = client.promise(function(done, error, info) {
        Meteor.call("createIngredients", info, function(err, id) {
          if(err) {
            done(err);
          } else {
            done(id);
          }
        });
      }, [info]);
      expect(result).not.to.be.equal(null);

      var check = server.execute(function(id) {
        var doc = Ingredients.findOne(id);
        return doc;
      }, [result]);
      // console.log(check);
      expect(check._id).to.be.equal(result);
    });
  });

  describe("editIngredient method", function() {
    it("update supplier", function() {
      var info = {
        "code": "VV Eggs",
        "description": "Eggs box",
        "suppliers": "Villa",
        "portionOrdered": "box",
        "unitSize": 180,
        "costPerPortion": 60,
        "portionUsed": 1
      }

      var ingredientId = server.execute(function(info) {
        var id = Ingredients.insert(info);
        return id;
      }, [info]);
      expect(ingredientId).not.to.be.equal(null);

      var updateDoc = {
        "suppliers": ["Villa", "Bella"]
      }

      var update = client.promise(function(done, error, id, info) {
        Meteor.call("editIngredient", id, info, function(err) {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      }, [ingredientId, updateDoc]);
      expect(update).to.be.equal(null);

      var check = server.execute(function(id) {
        var doc = Ingredients.findOne(id);
        return doc;
      }, [ingredientId]);
      // console.log(check);
      expect(check.suppliers.length).to.be.equal(2);
    });

    it("update description", function() {
      var info = {
        "code": "VV Eggs",
        "description": "Eggs box",
        "suppliers": "Villa",
        "portionOrdered": "box",
        "unitSize": 180,
        "costPerPortion": 60,
        "portionUsed": 1
      }

      var ingredientId = server.execute(function(info) {
        var id = Ingredients.insert(info);
        return id;
      }, [info]);
      expect(ingredientId).not.to.be.equal(null);

      var updateDoc = {
        "description": "Egg Boxes"
      }

      var update = client.promise(function(done, error, id, info) {
        Meteor.call("editIngredient", id, info, function(err) {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      }, [ingredientId, updateDoc]);
      expect(update).to.be.equal(null);

      var check = server.execute(function(id) {
        var doc = Ingredients.findOne(id);
        return doc;
      }, [ingredientId]);
      expect(check.description).to.be.equal(updateDoc.description);
    });

    it("update code", function() {
      var info = {
        "code": "VV Eggs",
        "description": "Eggs box",
        "suppliers": "Villa",
        "portionOrdered": "box",
        "unitSize": 180,
        "costPerPortion": 60,
        "portionUsed": 1
      }

      var ingredientId = server.execute(function(info) {
        var id = Ingredients.insert(info);
        return id;
      }, [info]);
      expect(ingredientId).not.to.be.equal(null);

      var updateDoc = {
        "code": "VVV Egg Boxes"
      }

      var update = client.promise(function(done, error, id, info) {
        Meteor.call("editIngredient", id, info, function(err) {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      }, [ingredientId, updateDoc]);
      expect(update).to.be.equal(null);

      var check = server.execute(function(id) {
        var doc = Ingredients.findOne(id);
        return doc;
      }, [ingredientId]);
      expect(check.code).to.be.equal(updateDoc.code);
    });
  });

  describe("deleteIngredient method", function() {
    it("remove", function() {
      var info = {
        "_id": "VV Eggs" + Math.random(),
        "description": "Eggs box",
        "suppliers": "Villa",
        "portionOrdered": "box",
        "unitSize": 180,
        "costPerPortion": 60,
        "portionUsed": 1
      }

      var ingredientId = server.execute(function(info) {
        var id = Ingredients.insert(info);
        return id;
      }, [info]);
      expect(ingredientId).not.to.be.equal(null);

      var deleteItem = client.promise(function(done, error, id) {
        Meteor.call("deleteIngredient", id, function(err) {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      }, [ingredientId]);
      expect(deleteItem).to.be.equal(null);

      var check = server.execute(function(id) {
        var doc = Ingredients.findOne(id);
        return doc;
      }, [info._id]);
      expect(check).to.be.equal(undefined);
    });
  });
});