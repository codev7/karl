var server = meteor({flavor: "fiber"});
var client = browser({flavor: "fiber", location: server});

createNewPrepItem = function() {
  var info = {
    "type": "prep",
    "recipe": "Recipe",
    "portions": 10,
    "activeTime": 10,
    "shelfLife": 1,
    "name": "test prep",
    "wagePerHour": 10,
    "ingredients": [{"id": 1, "quantity": 10}]
  }
  return JobItems.insert(info);
}

describe("Testing job item methods", function() {
  describe("createJobItem method", function() {
    it("Without logged in user", function() {
      var userErr = client.logout();
      var loggedInUser = client.execute(function() {
        return Meteor.user();
      });

      var info = {
        "type": "prep",
        "recipe": "Recipe",
        "portions": 10,
        "activeTime": 10,
        "shelfLife": 1,
        "name": "Test prep"
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
      // console.log(result);
      expect(result.error).to.be.equal(401);
    });

    describe("With logged in user", function() {
      describe("with admin", function() {
        it("without name", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;
          // console.log(loggedInUserId);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
            return;
          }, [loggedInUserId]);

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
          // console.log(result);
          expect(result.error).to.be.equal(404);
        });

        it("without active time", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;
          // console.log(loggedInUserId);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
            return;
          }, [loggedInUserId]);

          var info = {
            "type": "prep",
            "recipe": "Recipe",
            "portions": 10,
            "name": "test prep",
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
          // console.log(result);
          expect(result.error).to.be.equal(404);
        });

        it("duplicated name", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;
          // console.log(loggedInUserId);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
            return;
          }, [loggedInUserId]);

          var prepItem = server.execute(createNewPrepItem);
          expect(prepItem).to.be.not.equal(null);

          var info = {
            "type": "prep",
            "recipe": "Recipe",
            "portions": 10,
            "name": "test prep",
            "shelfLife": 1,
            "activeTime": 10
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
          // console.log(result);
          expect(result.error).to.be.equal(404);
        });

        it("adding ingredients", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;
          // console.log(loggedInUserId);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
            return;
          }, [loggedInUserId]);

          var prepItem = server.execute(createNewPrepItem);
          expect(prepItem).to.be.not.equal(null);

          var info = {
            "type": "prep",
            "recipe": "Recipe",
            "portions": 10,
            "name": "test prep job" + Math.random(),
            "shelfLife": 1,
            "activeTime": 10,
            "ingredients": [{"_id": 1, "quantity": 10}, {"_id": 12, "quantity":20}]
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
          // console.log(result);
          expect(result).not.to.be.equal(null);

          var check = server.execute(function(id) {
            return JobItems.findOne(id);
          }, [result]);
          // console.log(check);
          expect(check.ingredients.length).to.be.equal(2);
        });

        it("adding duplicated ingredients", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;
          // console.log(loggedInUserId);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
            return;
          }, [loggedInUserId]);

          var prepItem = server.execute(createNewPrepItem);
          expect(prepItem).to.be.not.equal(null);

          var info = {
            "type": "prep",
            "recipe": "Recipe",
            "portions": 10,
            "name": "test prep job" + Math.random(),
            "shelfLife": 1,
            "activeTime": 10,
            "ingredients": [{"_id": 1, "quantity": 10}, {"_id": 1, "quantity": 10}]
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
          // console.log(result);
          expect(result).not.to.be.equal(null);

          var check = server.execute(function(id) {
            return JobItems.findOne(id);
          }, [result]);
          // console.log(check);
          expect(check.ingredients.length).to.be.equal(1);
        });
      });

      describe("with manager", function() {
        it("without name", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;
          // console.log(loggedInUserId);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
            return;
          }, [loggedInUserId]);

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
          // console.log(result);
          expect(result.error).to.be.equal(404);
        });

        it("without active time", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;
          // console.log(loggedInUserId);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
            return;
          }, [loggedInUserId]);

          var info = {
            "type": "prep",
            "recipe": "Recipe",
            "portions": 10,
            "name": "test prep",
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
          // console.log(result);
          expect(result.error).to.be.equal(404);
        });

        it("duplicated name", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;
          // console.log(loggedInUserId);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
            return;
          }, [loggedInUserId]);

          var prepItem = server.execute(createNewPrepItem);
          expect(prepItem).to.be.not.equal(null);

          var info = {
            "type": "prep",
            "recipe": "Recipe",
            "portions": 10,
            "name": "test prep",
            "shelfLife": 1,
            "activeTime": 10
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
          // console.log(result);
          expect(result.error).to.be.equal(404);
        });
  
        it("adding ingredients", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;
          // console.log(loggedInUserId);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
            return;
          }, [loggedInUserId]);

          var prepItem = server.execute(createNewPrepItem);
          expect(prepItem).to.be.not.equal(null);

          var info = {
            "type": "prep",
            "recipe": "Recipe",
            "portions": 10,
            "name": "test prep job" + Math.random(),
            "shelfLife": 1,
            "activeTime": 10,
            "ingredients": [{"_id": 1, "quantity": 10}, {"_id": 12, "quantity":20}]
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
          // console.log(result);
          expect(result).not.to.be.equal(null);

          var check = server.execute(function(id) {
            return JobItems.findOne(id);
          }, [result]);
          // console.log(check);
          expect(check.ingredients.length).to.be.equal(2);
        });

        it("adding duplicated ingredients", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;
          // console.log(loggedInUserId);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
            return;
          }, [loggedInUserId]);

          var prepItem = server.execute(createNewPrepItem);
          expect(prepItem).to.be.not.equal(null);

          var info = {
            "type": "prep",
            "recipe": "Recipe",
            "portions": 10,
            "name": "test prep job" + Math.random(),
            "shelfLife": 1,
            "activeTime": 10,
            "ingredients": [{"_id": 1, "quantity": 10}, {"_id": 1, "quantity": 10}]
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
          // console.log(result);
          expect(result).not.to.be.equal(null);

          var check = server.execute(function(id) {
            return JobItems.findOne(id);
          }, [result]);
          // console.log(check);
          expect(check.ingredients.length).to.be.equal(1);
        });
      });
    });
  });

  describe("editJobItem method", function() {
    it("Without logged in user", function() {
      var userErr = client.logout();
      var loggedInUser = client.execute(function() {
        return Meteor.user();
      });

      var jobItem = server.execute(createNewPrepItem);
      expect(jobItem).not.to.be.equal(null);

      var info = {
        "name": "new job item",
        "recipe": "Recipe new",
        "activeTime": 20,
        "shelfLife": 2,
        "portions": 20
      }
      var result = client.promise(function(done, error, id, info) {
        Meteor.call("editJobItem", id, info, function(err) {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      }, [jobItem, info]);
      // console.log(result);
      expect(result.error).to.be.equal(401);
    });

    describe("With logged in user", function() {
      describe("With admin", function() {
        it("update name, active time", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
            return;
          }, [loggedInUserId]);

          var jobItem = server.execute(createNewPrepItem);
          expect(jobItem).not.to.be.equal(null);

          var info = {
            "name": "new job item",
            "recipe": "Recipe new",
            "activeTime": 20,
            "shelfLife": 2,
            "portions": 20,
            "ingredients": []
          }
          var result = client.promise(function(done, error, id, info) {
            Meteor.call("editJobItem", id, info, function(err) {
              if(err) {
                done(err);
              } else {
                done();
              }
            });
          }, [jobItem, info]);
          // console.log(result);
          expect(result).to.be.equal(null);

          var check = server.execute(function(id) {
            return JobItems.findOne(id)
          }, [jobItem]);
          // console.log(check);
          expect(check.name).to.be.equal(info.name);
          expect(check.recipe).to.be.equal(info.recipe);
          expect(check.portions).to.be.equal(info.portions);
        });

        it("update wage per hour", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
            return;
          }, [loggedInUserId]);

          var jobItem = server.execute(createNewPrepItem);
          expect(jobItem).not.to.be.equal(null);

          var info = {
            "wagePerHour": 60
          }
          var result = client.promise(function(done, error, id, info) {
            Meteor.call("editJobItem", id, info, function(err) {
              if(err) {
                done(err);
              } else {
                done();
              }
            });
          }, [jobItem, info]);
          // console.log(result);
          expect(result).to.be.equal(null);

          var check = server.execute(function(id) {
            return JobItems.findOne(id)
          }, [jobItem]);
          // console.log(check);
          expect(check.wagePerHour).to.be.equal(info.wagePerHour);
        });
  
        describe("update ingredients", function() {
          it("add new ingrdient item", function() {
            var username = 'user' + Math.random();
            var userErr = client.signUp({
              'username': username, 
              'password': username
            });
            var loggedInUser = client.execute(function() {
              return Meteor.user();
            });
            expect(loggedInUser).to.be.not.equal(null);
            var loggedInUserId = loggedInUser._id;

            var promote = server.execute(function(userId) {
              Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
              return;
            }, [loggedInUserId]);

            var jobItem = server.execute(createNewPrepItem);
            expect(jobItem).not.to.be.equal(null);  

            var info = {
              "name": "new job item",
              "recipe": "Recipe new",
              "ingredients": [{"id": 1, "quantity": 10}, {"id": 2, "quantity": 100}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editJobItem", id, info, function(err,id) {
                if(err) {
                  done(err);
                } else {
                  done(id);
                }
              });
            }, [jobItem, info]);
            // console.log(result);
            expect(result).not.to.be.equal(null);

           var check = server.execute(function(id) {
            return JobItems.findOne(id)
           }, [jobItem]);
           // console.log(check);
           expect(check.ingredients.length).to.be.equal(2);
          });

          it("remove existing item", function() {
            var username = 'user' + Math.random();
            var userErr = client.signUp({
              'username': username, 
              'password': username
            });
            var loggedInUser = client.execute(function() {
              return Meteor.user();
            });
            expect(loggedInUser).to.be.not.equal(null);
            var loggedInUserId = loggedInUser._id;

            var promote = server.execute(function(userId) {
              Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
              return;
            }, [loggedInUserId]);

            var jobItem = server.execute(createNewPrepItem);
            expect(jobItem).not.to.be.equal(null);  

            var info = {
              "name": "new job item",
              "recipe": "Recipe new",
              "ingredients": []
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editJobItem", id, info, function(err,id) {
                if(err) {
                  done(err);
                } else {
                  done(id);
                }
              });
            }, [jobItem, info]);
            // console.log(result);
            expect(result).not.to.be.equal(null);

           var check = server.execute(function(id) {
            return JobItems.findOne(id)
           }, [jobItem]);
           // console.log(check);
           expect(check.ingredients.length).to.be.equal(0);
          });

          it("update quantity", function() {
            var username = 'user' + Math.random();
            var userErr = client.signUp({
              'username': username, 
              'password': username
            });
            var loggedInUser = client.execute(function() {
              return Meteor.user();
            });
            expect(loggedInUser).to.be.not.equal(null);
            var loggedInUserId = loggedInUser._id;

            var promote = server.execute(function(userId) {
              Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
              return;
            }, [loggedInUserId]);

            var jobItem = server.execute(createNewPrepItem);
            expect(jobItem).not.to.be.equal(null);  

            var info = {
              "name": "new job item",
              "recipe": "Recipe new",
              "ingredients": [{"_id": 1, "quantity": 30}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editJobItem", id, info, function(err,id) {
                if(err) {
                  done(err);
                } else {
                  done(id);
                }
              });
            }, [jobItem, info]);
            // console.log(result);
            expect(result).not.to.be.equal(null);

           var check = server.execute(function(id) {
            return JobItems.findOne(id)
           }, [jobItem]);
           // console.log(check);
           expect(check.ingredients.length).to.be.equal(1);
          });
        });
      });

      describe("With manager", function() {
        it("update name, active time", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
            return;
          }, [loggedInUserId]);

          var jobItem = server.execute(createNewPrepItem);
          expect(jobItem).not.to.be.equal(null);

          var info = {
            "name": "new job item",
            "recipe": "Recipe new",
            "activeTime": 20,
            "shelfLife": 2,
            "portions": 20
          }
          var result = client.promise(function(done, error, id, info) {
            Meteor.call("editJobItem", id, info, function(err) {
              if(err) {
                done(err);
              } else {
                done();
              }
            });
          }, [jobItem, info]);
          // console.log(result);
          expect(result).to.be.equal(null);

          var check = server.execute(function(id) {
            return JobItems.findOne(id)
          }, [jobItem]);
          // console.log(check);
          expect(check.name).to.be.equal(info.name);
          expect(check.recipe).to.be.equal(info.recipe);
          expect(check.portions).to.be.equal(info.portions);
        });

        it("update wagePerHour", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
            return;
          }, [loggedInUserId]);

          var jobItem = server.execute(createNewPrepItem);
          expect(jobItem).not.to.be.equal(null);

          var info = {
            "wagePerHour": 60
          }
          var result = client.promise(function(done, error, id, info) {
            Meteor.call("editJobItem", id, info, function(err) {
              if(err) {
                done(err);
              } else {
                done();
              }
            });
          }, [jobItem, info]);
          // console.log(result);
          expect(result).to.be.equal(null);

          var check = server.execute(function(id) {
            return JobItems.findOne(id)
          }, [jobItem]);
          // console.log(check);
          expect(check.wagePerHour).to.be.equal(info.wagePerHour);
        });

        describe("update ingredients", function() {
          it("add new ingrdient item", function() {
            var username = 'user' + Math.random();
            var userErr = client.signUp({
              'username': username, 
              'password': username
            });
            var loggedInUser = client.execute(function() {
              return Meteor.user();
            });
            expect(loggedInUser).to.be.not.equal(null);
            var loggedInUserId = loggedInUser._id;

            var promote = server.execute(function(userId) {
              Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
              return;
            }, [loggedInUserId]);

            var jobItem = server.execute(createNewPrepItem);
            expect(jobItem).not.to.be.equal(null);  

            var info = {
              "name": "new job item",
              "recipe": "Recipe new",
              "ingredients": [{"id": 1, "quantity": 10}, {"id": 2, "quantity": 100}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editJobItem", id, info, function(err,id) {
                if(err) {
                  done(err);
                } else {
                  done(id);
                }
              });
            }, [jobItem, info]);
            // console.log(result);
            expect(result).not.to.be.equal(null);

           var check = server.execute(function(id) {
            return JobItems.findOne(id)
           }, [jobItem]);
           // console.log(check);
           expect(check.ingredients.length).to.be.equal(2);
          });

          it("remove existing item", function() {
            var username = 'user' + Math.random();
            var userErr = client.signUp({
              'username': username, 
              'password': username
            });
            var loggedInUser = client.execute(function() {
              return Meteor.user();
            });
            expect(loggedInUser).to.be.not.equal(null);
            var loggedInUserId = loggedInUser._id;

            var promote = server.execute(function(userId) {
              Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
              return;
            }, [loggedInUserId]);

            var jobItem = server.execute(createNewPrepItem);
            expect(jobItem).not.to.be.equal(null);  

            var info = {
              "name": "new job item",
              "recipe": "Recipe new",
              "ingredients": []
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editJobItem", id, info, function(err,id) {
                if(err) {
                  done(err);
                } else {
                  done(id);
                }
              });
            }, [jobItem, info]);
            // console.log(result);
            expect(result).not.to.be.equal(null);

           var check = server.execute(function(id) {
            return JobItems.findOne(id)
           }, [jobItem]);
           // console.log(check);
           expect(check.ingredients.length).to.be.equal(0);
          });

          it("update quantity", function() {
            var username = 'user' + Math.random();
            var userErr = client.signUp({
              'username': username, 
              'password': username
            });
            var loggedInUser = client.execute(function() {
              return Meteor.user();
            });
            expect(loggedInUser).to.be.not.equal(null);
            var loggedInUserId = loggedInUser._id;

            var promote = server.execute(function(userId) {
              Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
              return;
            }, [loggedInUserId]);

            var jobItem = server.execute(createNewPrepItem);
            expect(jobItem).not.to.be.equal(null);  

            var info = {
              "name": "new job item",
              "recipe": "Recipe new",
              "ingredients": [{"_id": 1, "quantity": 30}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editJobItem", id, info, function(err,id) {
                if(err) {
                  done(err);
                } else {
                  done(id);
                }
              });
            }, [jobItem, info]);
            // console.log(result);
            expect(result).not.to.be.equal(null);

           var check = server.execute(function(id) {
            return JobItems.findOne(id)
           }, [jobItem]);
           // console.log(check);
           expect(check.ingredients.length).to.be.equal(1);
          });
        });
      });
    });
  });

  describe("deleteJobItem method", function() {
    it("without logged in user", function() {
      var userErr = client.logout();
      var loggedInUser = client.execute(function() {
        return Meteor.user();
      });
      var jobItem = server.execute(createNewPrepItem);
      expect(jobItem).not.to.be.equal(null);

      var result = client.promise(function(done, error, id) {
        Meteor.call("deleteJobItem", id, function(err) {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      }, [jobItem]);
      // console.log(result);
      expect(result.error).to.be.equal(401);
    });

    describe("With logged in user", function() {
      describe("With Admin user", function() {
        it("job item not used in menu items", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
            return;
          }, [loggedInUserId]);

          var jobItem = server.execute(createNewPrepItem);
          expect(jobItem).not.to.be.equal(null);

          var result = client.promise(function(done, error, id) {
            Meteor.call("deleteJobItem", id, function(err) {
              if(err) {
                done(err);
              } else {
                done();
              }
            });
          }, [jobItem]);
          // console.log(result);
          expect(result).to.be.equal(null);

        });

        it("job item used in menu items", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
            return;
          }, [loggedInUserId]);

          var jobItem = server.execute(createNewPrepItem);
          expect(jobItem).not.to.be.equal(null);

          var menuItem = server.execute(function(id) {
            var item = {
              "name": "Home menu",
              "ingredients": [],
              "jobItems": [{"_id": id, "quantity": 1}]
            }
            return MenuItems.insert(item);
          }, [jobItem]);
          // console.log(menuItem);

          var result = client.promise(function(done, error, id) {
            Meteor.call("deleteJobItem", id, function(err) {
              if(err) {
                done(err);
              } else {
                done();
              }
            });
          }, [jobItem]);
          // console.log(result);
          expect(result.error).to.be.equal(404);

        });
      });

      describe("With Manager user", function() {
        it("job item not used in menu items", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
            return;
          }, [loggedInUserId]);

          var jobItem = server.execute(createNewPrepItem);
          expect(jobItem).not.to.be.equal(null);

          var result = client.promise(function(done, error, id) {
            Meteor.call("deleteJobItem", id, function(err) {
              if(err) {
                done(err);
              } else {
                done();
              }
            });
          }, [jobItem]);
          // console.log(result);
          expect(result).to.be.equal(null);

        });

        it("job item used in menu items", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({
            'username': username, 
            'password': username
          });
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
            return;
          }, [loggedInUserId]);

          var jobItem = server.execute(createNewPrepItem);
          expect(jobItem).not.to.be.equal(null);

          var menuItem = server.execute(function(id) {
            var item = {
              "name": "Home menu",
              "ingredients": [],
              "jobItems": [{"_id": id, "quantity": 1}]
            }
            return MenuItems.insert(item);
          }, [jobItem]);
          // console.log(menuItem);

          var result = client.promise(function(done, error, id) {
            Meteor.call("deleteJobItem", id, function(err) {
              if(err) {
                done(err);
              } else {
                done();
              }
            });
          }, [jobItem]);
          // console.log(result);
          expect(result.error).to.be.equal(404);

        });
      });
    });
  });
});