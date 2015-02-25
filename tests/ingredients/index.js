var server = meteor({flavor: "fiber"});
var client = browser({flavor: "fiber", location: server});

describe("Testing ingredients related methods", function() {
  describe("createIngredients method", function() {
    it("with one supplier", function() {
      var info = {
        "code": "VV Eggs" + Math.random(),
        "description": "Eggs box",
        "suppliers": "Villa",
        "unitOrdered": "box",
        "unitSize": 180,
        "costPerUnit": 60,
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
      expect(check._id).to.be.equal(info.code);
    });

    it("with few suppliers", function() {
      var info = {
        "code": "VV Eggs" + Math.random(),
        "description": "Eggs box",
        "suppliers": ["Villa", "Bella"],
        "unitOrdered": "box",
        "unitSize": 180,
        "costPerUnit": 60,
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
      expect(check._id).to.be.equal(info.code);
    });
  });
});