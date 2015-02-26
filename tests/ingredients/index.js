var server = meteor({flavor: "fiber"});
var client = browser({flavor: "fiber", location: server});

describe("Testing ingredients related methods", function() {
  // describe("createIngredients method", function() {
  //   it("with one supplier", function() {
  //     var info = {
  //       "code": "VV Eggs" + Math.random(),
  //       "description": "Eggs box",
  //       "suppliers": "Villa",
  //       "unitOrdered": "box",
  //       "unitSize": 180,
  //       "costPerUnit": 60,
  //       "portionUsed": 1
  //     }

  //     var result = client.promise(function(done, error, info) {
  //       Meteor.call("createIngredients", info, function(err, id) {
  //         if(err) {
  //           done(err);
  //         } else {
  //           done(id);
  //         }
  //       });
  //     }, [info]);
  //     expect(result).not.to.be.equal(null);

  //     var check = server.execute(function(id) {
  //       var doc = Ingredients.findOne(id);
  //       return doc;
  //     }, [result]);
  //     expect(check._id).to.be.equal(info.code);
  //   });

  //   it("with few suppliers", function() {
  //     var info = {
  //       "code": "VV Eggs" + Math.random(),
  //       "description": "Eggs box",
  //       "suppliers": ["Villa", "Bella"],
  //       "unitOrdered": "box",
  //       "unitSize": 180,
  //       "costPerUnit": 60,
  //       "portionUsed": 1
  //     }

  //     var result = client.promise(function(done, error, info) {
  //       Meteor.call("createIngredients", info, function(err, id) {
  //         if(err) {
  //           done(err);
  //         } else {
  //           done(id);
  //         }
  //       });
  //     }, [info]);
  //     expect(result).not.to.be.equal(null);

  //     var check = server.execute(function(id) {
  //       var doc = Ingredients.findOne(id);
  //       return doc;
  //     }, [result]);
  //     expect(check._id).to.be.equal(info.code);
  //   });
  // });

  describe("editIngredient method", function() {
    it("update supplier", function() {
      var info = {
        "_id": "VV Eggs" + Math.random(),
        "description": "Eggs box",
        "suppliers": "Villa",
        "unitOrdered": "box",
        "unitSize": 180,
        "costPerUnit": 60,
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
      }, [info._id]);
      expect(check.suppliers.length).to.be.equal(2);
    });

    it("update description", function() {
      var info = {
        "_id": "VV Eggs" + Math.random(),
        "description": "Eggs box",
        "suppliers": "Villa",
        "unitOrdered": "box",
        "unitSize": 180,
        "costPerUnit": 60,
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
      }, [info._id]);
      expect(check.description).to.be.equal(updateDoc.description);
    });
  });
});