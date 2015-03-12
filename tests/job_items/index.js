var server = meteor({flavor: "fiber"});
var client = browser({flavor: "fiber", location: server});

describe("Testing job item methods", function() {
  describe("createJobItem method", function() {
    it("without name", function() {
      var info = {
        "type": "prep",
        "recipe": "Recipe",
        "portions": 10,
        "activeTime": 10,
        "shelfLife": 1
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
          "activeTime": 10,
          "shelfLife": 1,
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
            "activeTime": 10,
            "shelfLife": 1,
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
          "activeTime": 10,
          "shelfLife": 1,
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

  // describe("editJobItem method", function() {
  //   it("check", function() {
  //     var jobItem = server.execute(function() {
  //       var info = {
  //         "_id": "new" + Math.random(),
  //         "name": "new",
  //         "type": "prep",
  //         "recipe": "Recipe",
  //         "portions": 10,
  //         "activeTime": 10,
  //         "shelfLife": 1
  //       }
  //       var id = JobItems.insert(info);
  //       return id;
  //     });
  //     expect(jobItem).to.be.not.equal(null);

  //     var info = {
  //       "name": "new job item",
  //       "recipe": "Recipe new",
  //       "activeTime": 20,
  //       "shelfLife": 2,
  //       "portions": 20
  //     }
  //     var result = client.promise(function(done, error, id, info) {
  //       Meteor.call("editJobItem", id, info, function(err) {
  //         if(err) {
  //           done(err);
  //         } else {
  //           done();
  //         }
  //       });
  //     }, [jobItem, info]);
  //     expect(result).to.be.equal(null);

  //    var check = server.execute(function(id) {
  //     return JobItems.findOne(id)
  //    }, [jobItem]);
  //    expect(check.name).to.be.equal(info.name);
  //   });

  //   it("update ingredients", function() {
  //     var jobItem = server.execute(function() {
  //       var info = {
  //         "_id": "new" + Math.random(),
  //         "name": "new",
  //         "type": "prep",
  //         "recipe": "Recipe",
  //         "portions": 10,
  //         "activeTime": 10,
  //         "shelfLife": 1,
  //         "ingredients": [{"id": 1, "quantity": 10}]
  //       }
  //       var id = JobItems.insert(info);
  //       return id;
  //     });
  //     expect(jobItem).to.be.not.equal(null);

  //     var info = {
  //       "name": "new job item",
  //       "recipe": "Recipe new",
  //       "ingredients": [{"id": 2, "quantity": 100}],
  //       "ingredientIds": [2]
  //     }
  //     var result = client.promise(function(done, error, id, info) {
  //       Meteor.call("editJobItem", id, info, function(err) {
  //         if(err) {
  //           done(err);
  //         } else {
  //           done();
  //         }
  //       });
  //     }, [jobItem, info]);
  //     expect(result).to.be.equal(null);

  //    var check = server.execute(function(id) {
  //     return JobItems.findOne(id)
  //    }, [jobItem]);
  //    expect(check.ingredients.length).to.be.equal(2);
  //   });

  //   it("update existing ingredients quantity", function() {
  //     var jobItem = server.execute(function() {
  //       var info = {
  //         "_id": "new" + Math.random(),
  //         "name": "new",
  //         "type": "prep",
  //         "recipe": "Recipe",
  //         "portions": 10,
  //         "activeTime": 10,
  //         "shelfLife": 1,
  //         "ingredients": [{"id": 1, "quantity": 10}]
  //       }
  //       var id = JobItems.insert(info);
  //       return id;
  //     });
  //     expect(jobItem).to.be.not.equal(null);

  //     var info = {
  //       "name": "new job item",
  //       "recipe": "Recipe new",
  //       "ingredients": [{"id": 1, "quantity": 100}],
  //       "ingredientIds": [1]
  //     }
  //     var result = client.promise(function(done, error, id, info) {
  //       Meteor.call("editJobItem", id, info, function(err) {
  //         if(err) {
  //           done(err);
  //         } else {
  //           done();
  //         }
  //       });
  //     }, [jobItem, info]);
  //     expect(result).to.be.equal(null);

  //    var check = server.execute(function(id) {
  //     return JobItems.findOne(id)
  //    }, [jobItem]);
  //    expect(check.ingredients[0].quantity).to.be.equal(100);
  //   });
  // });

  // describe("deleteJobItem method", function() {
  //   it("delete", function() {
  //     var jobItem = server.execute(function() {
  //       var info = {
  //         "_id": "new" + Math.random(),
  //         "name": "new",
  //         "type": "prep",
  //         "recipe": "Recipe",
  //         "portions": 10,
  //         "activeTime": 10,
  //         "shelfLife": 1
  //       }
  //       var id = JobItems.insert(info);
  //       return id;
  //     });
  //     expect(jobItem).to.be.not.equal(null);

  //     var result = client.promise(function(done, error, id) {
  //       Meteor.call("deleteJobItem", id, function(err) {
  //         if(err) {
  //           done(err);
  //         } else {
  //           done();
  //         }
  //       });
  //     }, [jobItem]);
  //     expect(result).to.be.equal(null);

  //     var check = server.execute(function(id) {
  //       return JobItems.findOne(id)
  //     }, [jobItem]);
  //     expect(check).to.be.equal(undefined);
  //   });
  // });
});