var server = meteor({flavor: "fiber"});
var client = browser({flavor: "fiber", location: server});

describe("Testing job item methods", function() {
  describe("createJobItem method", function() {
    it("without name", function() {
      var info = {
        "type": "prep",
        "recipe": "Recipe",
        "portions": 10,
        "activeTime": 10*60,
        "shelfLife": 1*24*60*60,
        "createdOn": Date.now()
      }
      var result = client.promise(function(done, error, info) {
        Meteor.call("createJobItem", info, function(err, id) {
          if(err) {
            done(err);
          } else {
            done(id);
          }
        });
      }, [info]);
      expect(result.error).to.be.equal(404);
    });

    describe("with name", function() {
      it("check", function() {
        var info = {
          "name": "new job item" + Math.random(),
          "type": "prep",
          "recipe": "Recipe",
          "portions": 10,
          "activeTime": 10*60,
          "shelfLife": 1*24*60*60,
          "createdOn": Date.now()
        }

        var result = client.promise(function(done, error, info) {
          Meteor.call("createJobItem", info, function(err, id) {
            if(err) {
              done(err);
            } else {
              done(id);
            }
          });
        }, [info]);
        expect(result).to.be.not.equal(null);
      });

      it("duplicated name", function() {
        var jobItem = server.execute(function() {
          var info = {
            "_id": "new",
            "name": "new",
            "type": "prep",
            "recipe": "Recipe",
            "portions": 10,
            "activeTime": 10*60,
            "shelfLife": 1*24*60*60,
            "createdOn": Date.now()
          }
          var id = JobItems.insert(info);
          return id;
        });
        expect(jobItem).to.be.not.equal(null);

        var doc = {
          "name": "new",
          "type": "prep",
          "recipe": "Recipe",
          "portions": 10,
          "activeTime": 10*60,
          "shelfLife": 1*24*60*60,
          "createdOn": Date.now()
        }
        var result = client.promise(function(done, error, info) {
          Meteor.call("createJobItem", info, function(err, id) {
            if(err) {
              done(err);
            } else {
              done(id);
            }
          });
        }, [doc]);
        expect(result.error).to.be.equal(404);
      });
    });
  });
});