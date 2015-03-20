var server = meteor({flavor: "fiber"});
var client = browser({flavor: "fiber", location: server});

createIngredients = function(done, error) {
  var info = {
    "code": "VV Eggs" + Math.random(),
    "description": "Eggs box",
    "suppliers": ["Villa"],
    "portionOrdered": "box",
    "unitSize": 180,
    "costPerPortion": 60,
    "portionUsed": 1
  }

  Meteor.call("createIngredients", info, function(err, id) {
    if(err) {
      done(err);
    } else {
      done(id);
    }
  });
}

createNewIngredient = function() {
  var info = {
    "code": "VV Eggs",
    "description": "Eggs box",
    "suppliers": "Villa",
    "portionOrdered": "box",
    "unitSize": 180,
    "costPerPortion": 60,
    "portionUsed": 1
  }
  var id = Ingredients.insert(info);
  return id;
}

describe("Testing ingredients related methods", function() {
  describe("createIngredients method", function() {
    it("Without logged in user", function() {
      var result = client.promise(createIngredients);
      expect(result.error).to.be.equal(401);
    });

    describe("With logged in user", function() {
      describe("With admin user", function() {
        it("with duplicated code", function() {
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
            "code": "VV Eggs",
            "description": "Eggs box",
            "suppliers": ["Villa", "Bella"],
            "portionOrdered": "box",
            "costPerPortion": 60,
            "portionUsed": 1,
            "unitSize": 180,
          }

          var ingredient = server.execute(function(info) {
            return Ingredients.insert(info);
          }, [info]);

          var result = client.promise(function(done, error) {
            var info = {
              "code": "VV Eggs",
              "description": "Eggs box",
              "suppliers": ["Villa"],
              "portionOrdered": "box",
              "unitSize": 180,
              "costPerPortion": 60,
              "portionUsed": 1
            }

            Meteor.call("createIngredients", info, function(err, id) {
              if(err) {
                done(err);
              } else {
                done(id);
              }
            });
          });
          expect(result.error).to.be.equal(404);
          // console.log(result);
        });

        it("with one supplier", function() {  
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

          var result = client.promise(createIngredients);
          expect(result).not.to.be.equal(null);
          // console.log(result);

          var check = server.execute(function(id) {
            var doc = Ingredients.findOne(id);
            return doc;
          }, [result]);
          // console.log(check);
          expect(check._id).to.be.equal(result);
        });

        it("with few suppliers", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({username: username, password: username});
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;
          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
            return;
          }, [loggedInUserId]);
          // console.log(loggedInUserId);

          var info = {
            "code": "VV Eggs" + Math.random(),
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
          // console.log(result);

          var check = server.execute(function(id) {
            var doc = Ingredients.findOne(id);
            return doc;
          }, [result]);
          // console.log(check);
          expect(check._id).to.be.equal(result);
        });
      });
      
      describe("With manager user", function() {
        it("with duplicated code", function() {
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
            "code": "VV Eggs",
            "description": "Eggs box",
            "suppliers": ["Villa", "Bella"],
            "portionOrdered": "box",
            "costPerPortion": 60,
            "portionUsed": 1,
            "unitSize": 180,
          }

          var ingredient = server.execute(function(info) {
            return Ingredients.insert(info);
          }, [info]);

          var result = client.promise(function(done, error) {
            var info = {
              "code": "VV Eggs",
              "description": "Eggs box",
              "suppliers": ["Villa"],
              "portionOrdered": "box",
              "unitSize": 180,
              "costPerPortion": 60,
              "portionUsed": 1
            }

            Meteor.call("createIngredients", info, function(err, id) {
              if(err) {
                done(err);
              } else {
                done(id);
              }
            });
          });
          expect(result.error).to.be.equal(404);
          // console.log(result);
        });

        it("with one supplier", function() {  
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

          var result = client.promise(createIngredients);
          expect(result).not.to.be.equal(null);
          // console.log(result);

          var check = server.execute(function(id) {
            var doc = Ingredients.findOne(id);
            return doc;
          }, [result]);
          // console.log(check);
          expect(check._id).to.be.equal(result);
        });

        it("with few suppliers", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({username: username, password: username});
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;
          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
            return;
          }, [loggedInUserId]);
          // console.log(loggedInUserId);

          var info = {
            "code": "VV Eggs" + Math.random(),
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
          // console.log(result);

          var check = server.execute(function(id) {
            var doc = Ingredients.findOne(id);
            return doc;
          }, [result]);
          // console.log(check);
          expect(check._id).to.be.equal(result);
        });
      });
    });
  });

  describe("editIngredient method", function() {
    it("Without logged in user", function() {
      var userErr = client.logout();
      var loggedInUser = client.execute(function() {
        return Meteor.user();
      });
      expect(loggedInUser).to.be.equal(null);

      var ingredientId = server.execute(createNewIngredient);
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
      // console.log(update);
      expect(update.error).to.be.equal(401);
    });

    describe("With logged in user", function() {
      describe("With Admin", function() {
        it("update supplier", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({username: username, password: username});
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          // console.log(loggedInUser);
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;

          var ingredientId = server.execute(createNewIngredient);
          expect(ingredientId).not.to.be.equal(null);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
            return;
          }, [loggedInUserId]);

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
          var username = 'user' + Math.random();
          var userErr = client.signUp({username: username, password: username});
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;

          var ingredientId = server.execute(createNewIngredient);
          expect(ingredientId).not.to.be.equal(null);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
            return;
          }, [loggedInUserId]);

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
          var username = 'user' + Math.random();
          var userErr = client.signUp({username: username, password: username});
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;

          var ingredientId = server.execute(createNewIngredient);
          expect(ingredientId).not.to.be.equal(null);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
            return;
          }, [loggedInUserId]);

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

      describe("With Manager", function() {
        it("update supplier", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({username: username, password: username});
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          // console.log(loggedInUser);
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;

          var ingredientId = server.execute(createNewIngredient);
          expect(ingredientId).not.to.be.equal(null);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
            return;
          }, [loggedInUserId]);

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
          var username = 'user' + Math.random();
          var userErr = client.signUp({username: username, password: username});
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;

          var ingredientId = server.execute(createNewIngredient);
          expect(ingredientId).not.to.be.equal(null);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
            return;
          }, [loggedInUserId]);

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
          var username = 'user' + Math.random();
          var userErr = client.signUp({username: username, password: username});
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;

          var ingredientId = server.execute(createNewIngredient);
          expect(ingredientId).not.to.be.equal(null);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
            return;
          }, [loggedInUserId]);

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
    });
  });

  describe("deleteIngredient method", function() {
    it("Without logged in user", function() {
      var userErr = client.logout();
      var loggedInUser = client.execute(function() {
        return Meteor.user();
      });
      expect(loggedInUser).to.be.equal(null);

      var ingredientId = server.execute(createNewIngredient);
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
      // console.log(deleteItem);
      expect(deleteItem.error).to.be.equal(401);
    });

    describe("With logged in user", function() {
      describe("With Admin", function() {
        it("Non used ingredient", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({username: username, password: username});
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;

          var ingredientId = server.execute(createNewIngredient);
          expect(ingredientId).not.to.be.equal(null);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
            return;
          }, [loggedInUserId]);

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
          }, [ingredientId]);
          // console.log(check);
          expect(check).to.be.equal(undefined);
        });

        describe("Used ingredient", function() {
          it("In menu Item", function() {
            var username = 'user' + Math.random();
            var userErr = client.signUp({username: username, password: username});
            var loggedInUser = client.execute(function() {
              return Meteor.user();
            });
            expect(loggedInUser).to.be.not.equal(null);
            var loggedInUserId = loggedInUser._id;

            var ingredientId = server.execute(createNewIngredient);
            expect(ingredientId).not.to.be.equal(null);

            var updateMenuItem = server.execute(function(ingredientId) {
              var menuItem = MenuItems.insert({
                "name": "test menu", 
                "ingredients": [{ "_id": ingredientId, "quantity": 10}]
              });
              return menuItem;
            }, [ingredientId]);
            // console.log(updateMenuItem);

            var promote = server.execute(function(userId) {
              Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
              return;
            }, [loggedInUserId]);


            var deleteItem = client.promise(function(done, error, id) {
              Meteor.call("deleteIngredient", id, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [ingredientId]);
            // console.log(deleteItem);
            expect(deleteItem.error).to.be.equal(404);

            var check = server.execute(function(id) {
              var doc = Ingredients.findOne(id);
              return doc;
            }, [ingredientId]);
            // console.log(check);
            expect(check._id).to.be.equal(ingredientId);    
          });

          it("In prep Item", function() {
            var username = 'user' + Math.random();
            var userErr = client.signUp({username: username, password: username});
            var loggedInUser = client.execute(function() {
              return Meteor.user();
            });
            expect(loggedInUser).to.be.not.equal(null);
            var loggedInUserId = loggedInUser._id;

            var ingredientId = server.execute(createNewIngredient);
            expect(ingredientId).not.to.be.equal(null);

            var updatePrepItem = server.execute(function(ingredientId) {
              var prepItem = JobItems.insert({
                "name": "test prep", 
                "type": "Prep",
                "ingredients": [{ "_id": ingredientId, "quantity": 10}]
              });
              return prepItem;
            }, [ingredientId]);
            // console.log(updatePrepItem);

            var promote = server.execute(function(userId) {
              Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
              return;
            }, [loggedInUserId]);

            var deleteItem = client.promise(function(done, error, id) {
              Meteor.call("deleteIngredient", id, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [ingredientId]);
            // console.log(deleteItem);
            expect(deleteItem.error).to.be.equal(404);

            var check = server.execute(function(id) {
              var doc = Ingredients.findOne(id);
              return doc;
            }, [ingredientId]);
            // console.log(check);
            expect(check._id).to.be.equal(ingredientId);    
          });
        });
      });

      describe("With Manager", function() {
        it("Non used ingredient", function() {
          var username = 'user' + Math.random();
          var userErr = client.signUp({username: username, password: username});
          var loggedInUser = client.execute(function() {
            return Meteor.user();
          });
          expect(loggedInUser).to.be.not.equal(null);
          var loggedInUserId = loggedInUser._id;

          var ingredientId = server.execute(createNewIngredient);
          expect(ingredientId).not.to.be.equal(null);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
            return;
          }, [loggedInUserId]);

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
          }, [ingredientId]);
          // console.log(check);
          expect(check).to.be.equal(undefined);
        });

        describe("Used ingredient", function() {
          it("In menu Item", function() {
            var username = 'user' + Math.random();
            var userErr = client.signUp({username: username, password: username});
            var loggedInUser = client.execute(function() {
              return Meteor.user();
            });
            expect(loggedInUser).to.be.not.equal(null);
            var loggedInUserId = loggedInUser._id;

            var ingredientId = server.execute(createNewIngredient);
            expect(ingredientId).not.to.be.equal(null);

            var updateMenuItem = server.execute(function(ingredientId) {
              var menuItem = MenuItems.insert({
                "name": "test menu", 
                "ingredients": [{ "_id": ingredientId, "quantity": 10}]
              });
              return menuItem;
            }, [ingredientId]);
            // console.log(updateMenuItem);

            var promote = server.execute(function(userId) {
              Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
              return;
            }, [loggedInUserId]);


            var deleteItem = client.promise(function(done, error, id) {
              Meteor.call("deleteIngredient", id, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [ingredientId]);
            // console.log(deleteItem);
            expect(deleteItem.error).to.be.equal(404);

            var check = server.execute(function(id) {
              var doc = Ingredients.findOne(id);
              return doc;
            }, [ingredientId]);
            // console.log(check);
            expect(check._id).to.be.equal(ingredientId);    
          });

          it("In prep Item", function() {
            var username = 'user' + Math.random();
            var userErr = client.signUp({username: username, password: username});
            var loggedInUser = client.execute(function() {
              return Meteor.user();
            });
            expect(loggedInUser).to.be.not.equal(null);
            var loggedInUserId = loggedInUser._id;

            var ingredientId = server.execute(createNewIngredient);
            expect(ingredientId).not.to.be.equal(null);

            var updatePrepItem = server.execute(function(ingredientId) {
              var prepItem = JobItems.insert({
                "name": "test prep", 
                "type": "Prep",
                "ingredients": [{ "_id": ingredientId, "quantity": 10}]
              });
              return prepItem;
            }, [ingredientId]);
            // console.log(updatePrepItem);

            var promote = server.execute(function(userId) {
              Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
              return;
            }, [loggedInUserId]);

            var deleteItem = client.promise(function(done, error, id) {
              Meteor.call("deleteIngredient", id, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [ingredientId]);
            // console.log(deleteItem);
            expect(deleteItem.error).to.be.equal(404);

            var check = server.execute(function(id) {
              var doc = Ingredients.findOne(id);
              return doc;
            }, [ingredientId]);
            // console.log(check);
            expect(check._id).to.be.equal(ingredientId);    
          });
        });
      });
    });
  });
});