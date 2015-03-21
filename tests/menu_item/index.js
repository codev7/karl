var server = meteor({flavor: "fiber"});
var client = browser({flavor: "fiber", location: server});

createNewMenuItem = function() {
   var info = {
    "tag": ["kids"],
    "instructions": "Cook",
    "prepItems": [],
    "ingredients": [{"_id": 2, "quantity": 100}],
    "jobItems": [{"_id": 1, "quantity": 1}],
    "salesPrice": 30,
    "name": "Test menu"
  }
  return MenuItems.insert(info);  
}

describe("Testing menu related methods", function() {
  describe("createMenuItem method", function() {
    it("Without logged in user", function() {
      var userErr = client.logout();
      var loggedInUser = client.execute(function() {
        return Meteor.user();
      });
      var info = {
        "tag": "kids",
        "instructions": "Cook",
        "prepItems": [],
        "shelfLife": 20,
        "ingredients": [],
        "salesPrice": 30,
        "name": "New menu"
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
      // console.log(result);
      expect(result.error).to.be.equal(401);
    });

    describe("With logged in user", function() {
      describe("With Admin user", function() {
        it("Without name", function() {
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
          // console.log(result);
          expect(result.error).to.be.equal(404);
        });
        
        it("With duplicated name", function() {
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

          var menuItem = server.execute(createNewMenuItem);
          expect(menuItem).not.to.be.equal(null);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
            return;
          }, [loggedInUserId]);

          var info = {
            "tag": "kids",
            "instructions": "Cook",
            "prepItems": [],
            "shelfLife": 20,
            "ingredients": [],
            "salesPrice": 30,
            "name": "Test menu"
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
          // console.log(result);
          expect(result.error).to.be.equal(404);
        });
      });

      describe("With Manager user", function() {
        it("Without name", function() {
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
          // console.log(result);
          expect(result.error).to.be.equal(404);
        });
        
        it("With duplicated name", function() {
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

          var menuItem = server.execute(createNewMenuItem);
          expect(menuItem).not.to.be.equal(null);

          var promote = server.execute(function(userId) {
            Meteor.users.update({'_id': userId}, {$set: {"isManager": true}});
            return;
          }, [loggedInUserId]);

          var info = {
            "tag": "kids",
            "instructions": "Cook",
            "prepItems": [],
            "shelfLife": 20,
            "ingredients": [],
            "salesPrice": 30,
            "name": "Test menu"
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
          // console.log(result);
          expect(result.error).to.be.equal(404);
        });
      });
    });
  });

  describe("editMenuItem method", function() {
    it("Without logged in user", function() {
      var userErr = client.logout();
      var loggedInUser = client.execute(function() {
        return Meteor.user();
      });

      var menuItem = server.execute(createNewMenuItem);
      expect(menuItem).not.to.be.equal(null);

      var info = {
        "tag": "kids",
        "instructions": "Cook",
        "prepItems": [],
        "shelfLife": 20,
        "ingredients": [],
        "salesPrice": 30,
        "name": "New menu"
      }
      var result = client.promise(function(done, error, id, info) {
        Meteor.call("editMenuItem",id, info, function(err) {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      }, [menuItem, info]);
      // console.log(result);
      expect(result.error).to.be.equal(401);
    });

    describe("With logged in user", function() {
      describe("With Admin user", function() {
        it("edit name, salesPrice", function() {
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


          var menuItem = server.execute(createNewMenuItem);
          expect(menuItem).not.to.be.equal(null);

          var info = {
            "tag": "kids",
            "instructions": "Cook",
            "prepItems": [],
            "shelfLife": 10,
            "ingredients": [],
            "salesPrice": 100,
            "name": "New menu"
          }
          var result = client.promise(function(done, error, id, info) {
            Meteor.call("editMenuItem",id, info, function(err) {
              if(err) {
                done(err);
              } else {
                done();
              }
            });
          }, [menuItem, info]);
          // console.log(result);
          expect(result).to.be.equal(null);

          var check = server.execute(function(id) {
            return MenuItems.findOne(id);
          }, [menuItem]);
          // console.log(check);
          expect(check.name).to.be.equal(info.name);
          expect(check.salesPrice).to.be.equal(info.salesPrice);
        });

        it("edit tag", function() {
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


          var menuItem = server.execute(createNewMenuItem);
          expect(menuItem).not.to.be.equal(null);

          var info = {
            "tag": ["kids", "main"]
          }
          var result = client.promise(function(done, error, id, info) {
            Meteor.call("editMenuItem",id, info, function(err) {
              if(err) {
                done(err);
              } else {
                done();
              }
            });
          }, [menuItem, info]);
          // console.log(result);
          expect(result).to.be.equal(null);

          var check = server.execute(function(id) {
            return MenuItems.findOne(id);
          }, [menuItem]);
          // console.log(check);
          expect(check.tag.length).to.be.equal(info.tag.length);
        });
    
        describe("edit ingredients", function() {
          it("add new ingredient", function() {
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


            var menuItem = server.execute(createNewMenuItem);
            expect(menuItem).not.to.be.equal(null);

            var info = {
              "ingredients": [{"_id": 2, "quantity": 100}, {"_id": 1, "quantity": 10}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editMenuItem",id, info, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [menuItem, info]);
            // console.log(result);
            expect(result).to.be.equal(null);

            var check = server.execute(function(id) {
              return MenuItems.findOne(id);
            }, [menuItem]);
            // console.log(check);
            expect(check.ingredients.length).to.be.equal(info.ingredients.length);
          });

          it("remove ingredient", function() {
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


            var menuItem = server.execute(createNewMenuItem);
            expect(menuItem).not.to.be.equal(null);

            var info = {
              "ingredients": [{"_id": 1, "quantity": 10}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editMenuItem",id, info, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [menuItem, info]);
            // console.log(result);
            expect(result).to.be.equal(null);

            var check = server.execute(function(id) {
              return MenuItems.findOne(id);
            }, [menuItem]);
            // console.log(check);
            expect(check.ingredients.length).to.be.equal(info.ingredients.length);
          });

          it("add duplicated ingredient", function() {
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


            var menuItem = server.execute(createNewMenuItem);
            expect(menuItem).not.to.be.equal(null);

            var info = {
              "ingredients": [{"_id": 2, "quantity": 90}, {"_id": 2, "quantity": 10}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editMenuItem",id, info, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [menuItem, info]);
            // console.log(result);
            expect(result).to.be.equal(null);

            var check = server.execute(function(id) {
              return MenuItems.findOne(id);
            }, [menuItem]);
            // console.log(check);
            expect(check.ingredients.length).to.be.equal(1);
          });

          it("change quantity", function() {
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


            var menuItem = server.execute(createNewMenuItem);
            expect(menuItem).not.to.be.equal(null);

            var info = {
              "ingredients": [{"_id": 2, "quantity": 90}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editMenuItem",id, info, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [menuItem, info]);
            // console.log(result);
            expect(result).to.be.equal(null);

            var check = server.execute(function(id) {
              return MenuItems.findOne(id);
            }, [menuItem]);
            // console.log(check);
            expect(check.ingredients.length).to.be.equal(info.ingredients.length);
          });
        });

        describe("edit job items", function() {
          it("add new prep item", function() {
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


            var menuItem = server.execute(createNewMenuItem);
            expect(menuItem).not.to.be.equal(null);

            var info = {
              "jobItems": [{"_id": 2, "quantity": 100}, {"_id": 1, "quantity": 10}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editMenuItem",id, info, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [menuItem, info]);
            // console.log(result);
            expect(result).to.be.equal(null);

            var check = server.execute(function(id) {
              return MenuItems.findOne(id);
            }, [menuItem]);
            // console.log(check);
            expect(check.jobItems.length).to.be.equal(info.jobItems.length);
          });

          it("remove existing job item", function() {
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


            var menuItem = server.execute(createNewMenuItem);
            expect(menuItem).not.to.be.equal(null);

            var info = {
              "jobItems": [{"_id": 2, "quantity": 10}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editMenuItem",id, info, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [menuItem, info]);
            // console.log(result);
            expect(result).to.be.equal(null);

            var check = server.execute(function(id) {
              return MenuItems.findOne(id);
            }, [menuItem]);
            // console.log(check);
            expect(check.jobItems.length).to.be.equal(info.jobItems.length);
          });

          it("duplicated job item", function() {
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


            var menuItem = server.execute(createNewMenuItem);
            expect(menuItem).not.to.be.equal(null);

            var info = {
              "jobItems": [{"_id": 1, "quantity": 10}, {"_id": 1, "quantity": 100}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editMenuItem",id, info, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [menuItem, info]);
            // console.log(result);
            expect(result).to.be.equal(null);

            var check = server.execute(function(id) {
              return MenuItems.findOne(id);
            }, [menuItem]);
            // console.log(check);
            expect(check.jobItems.length).to.be.equal(1);
          });

          it("change quantity", function() {
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


            var menuItem = server.execute(createNewMenuItem);
            expect(menuItem).not.to.be.equal(null);

            var info = {
              "jobItems": [{"_id": 1, "quantity": 100}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editMenuItem",id, info, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [menuItem, info]);
            // console.log(result);
            expect(result).to.be.equal(null);

            var check = server.execute(function(id) {
              return MenuItems.findOne(id);
            }, [menuItem]);
            // console.log(check);
            expect(check.jobItems.length).to.be.equal(1);
          });
        });
      });

      describe("With Manager user", function() {
        it("edit name, salesPrice", function() {
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


          var menuItem = server.execute(createNewMenuItem);
          expect(menuItem).not.to.be.equal(null);

          var info = {
            "tag": "kids",
            "instructions": "Cook",
            "prepItems": [],
            "shelfLife": 10,
            "ingredients": [],
            "salesPrice": 100,
            "name": "New menu"
          }
          var result = client.promise(function(done, error, id, info) {
            Meteor.call("editMenuItem",id, info, function(err) {
              if(err) {
                done(err);
              } else {
                done();
              }
            });
          }, [menuItem, info]);
          // console.log(result);
          expect(result).to.be.equal(null);

          var check = server.execute(function(id) {
            return MenuItems.findOne(id);
          }, [menuItem]);
          // console.log(check);
          expect(check.name).to.be.equal(info.name);
          expect(check.salesPrice).to.be.equal(info.salesPrice);
        });

        it("edit tag", function() {
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


          var menuItem = server.execute(createNewMenuItem);
          expect(menuItem).not.to.be.equal(null);

          var info = {
            "tag": ["kids", "main"]
          }
          var result = client.promise(function(done, error, id, info) {
            Meteor.call("editMenuItem",id, info, function(err) {
              if(err) {
                done(err);
              } else {
                done();
              }
            });
          }, [menuItem, info]);
          // console.log(result);
          expect(result).to.be.equal(null);

          var check = server.execute(function(id) {
            return MenuItems.findOne(id);
          }, [menuItem]);
          // console.log(check);
          expect(check.tag.length).to.be.equal(info.tag.length);
        });
    
        describe("edit ingredients", function() {
          it("add new ingredient", function() {
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


            var menuItem = server.execute(createNewMenuItem);
            expect(menuItem).not.to.be.equal(null);

            var info = {
              "ingredients": [{"_id": 2, "quantity": 100}, {"_id": 1, "quantity": 10}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editMenuItem",id, info, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [menuItem, info]);
            // console.log(result);
            expect(result).to.be.equal(null);

            var check = server.execute(function(id) {
              return MenuItems.findOne(id);
            }, [menuItem]);
            // console.log(check);
            expect(check.ingredients.length).to.be.equal(info.ingredients.length);
          });

          it("remove ingredient", function() {
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


            var menuItem = server.execute(createNewMenuItem);
            expect(menuItem).not.to.be.equal(null);

            var info = {
              "ingredients": [{"_id": 1, "quantity": 10}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editMenuItem",id, info, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [menuItem, info]);
            // console.log(result);
            expect(result).to.be.equal(null);

            var check = server.execute(function(id) {
              return MenuItems.findOne(id);
            }, [menuItem]);
            // console.log(check);
            expect(check.ingredients.length).to.be.equal(info.ingredients.length);
          });

          it("add duplicated ingredient", function() {
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


            var menuItem = server.execute(createNewMenuItem);
            expect(menuItem).not.to.be.equal(null);

            var info = {
              "ingredients": [{"_id": 2, "quantity": 90}, {"_id": 2, "quantity": 10}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editMenuItem",id, info, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [menuItem, info]);
            // console.log(result);
            expect(result).to.be.equal(null);

            var check = server.execute(function(id) {
              return MenuItems.findOne(id);
            }, [menuItem]);
            // console.log(check);
            expect(check.ingredients.length).to.be.equal(1);
          });

          it("change quantity", function() {
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


            var menuItem = server.execute(createNewMenuItem);
            expect(menuItem).not.to.be.equal(null);

            var info = {
              "ingredients": [{"_id": 2, "quantity": 90}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editMenuItem",id, info, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [menuItem, info]);
            // console.log(result);
            expect(result).to.be.equal(null);

            var check = server.execute(function(id) {
              return MenuItems.findOne(id);
            }, [menuItem]);
            // console.log(check);
            expect(check.ingredients.length).to.be.equal(info.ingredients.length);
          });
        });

        describe("edit job items", function() {
          it("add new prep item", function() {
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


            var menuItem = server.execute(createNewMenuItem);
            expect(menuItem).not.to.be.equal(null);

            var info = {
              "jobItems": [{"_id": 2, "quantity": 100}, {"_id": 1, "quantity": 10}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editMenuItem",id, info, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [menuItem, info]);
            // console.log(result);
            expect(result).to.be.equal(null);

            var check = server.execute(function(id) {
              return MenuItems.findOne(id);
            }, [menuItem]);
            // console.log(check);
            expect(check.jobItems.length).to.be.equal(info.jobItems.length);
          });

          it("remove existing job item", function() {
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


            var menuItem = server.execute(createNewMenuItem);
            expect(menuItem).not.to.be.equal(null);

            var info = {
              "jobItems": [{"_id": 2, "quantity": 10}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editMenuItem",id, info, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [menuItem, info]);
            // console.log(result);
            expect(result).to.be.equal(null);

            var check = server.execute(function(id) {
              return MenuItems.findOne(id);
            }, [menuItem]);
            // console.log(check);
            expect(check.jobItems.length).to.be.equal(info.jobItems.length);
          });

          it("duplicated job item", function() {
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


            var menuItem = server.execute(createNewMenuItem);
            expect(menuItem).not.to.be.equal(null);

            var info = {
              "jobItems": [{"_id": 1, "quantity": 10}, {"_id": 1, "quantity": 100}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editMenuItem",id, info, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [menuItem, info]);
            // console.log(result);
            expect(result).to.be.equal(null);

            var check = server.execute(function(id) {
              return MenuItems.findOne(id);
            }, [menuItem]);
            // console.log(check);
            expect(check.jobItems.length).to.be.equal(1);
          });

          it("change quantity", function() {
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


            var menuItem = server.execute(createNewMenuItem);
            expect(menuItem).not.to.be.equal(null);

            var info = {
              "jobItems": [{"_id": 1, "quantity": 100}]
            }
            var result = client.promise(function(done, error, id, info) {
              Meteor.call("editMenuItem",id, info, function(err) {
                if(err) {
                  done(err);
                } else {
                  done();
                }
              });
            }, [menuItem, info]);
            // console.log(result);
            expect(result).to.be.equal(null);

            var check = server.execute(function(id) {
              return MenuItems.findOne(id);
            }, [menuItem]);
            // console.log(check);
            expect(check.jobItems.length).to.be.equal(1);
          });
        });
      });
    });
  });

  describe("deleteMenuItem method", function() {
    it("check", function() {
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

      var result = client.promise(function(done, error, id) {
        Meteor.call("deleteMenuItem", id, function(err) {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      }, [menuItem]);
      expect(result).to.be.equal(null);

      var check = server.execute(function(id) {
        return MenuItems.findOne(id);
      }, [menuItem]);
      expect(check).to.be.equal(undefined);
    });
  });

  // describe("addIngredients method", function() {
  //   it("without menu item", function() {
  //     var menuItem = "1";
  //     var ingredients = [{"id": "1", "quantity": "10g"}];

  //     var result = client.promise(function(done, error, menuItem, ingredients) {
  //       Meteor.call("addIngredients", menuItem, ingredients, function(err) {
  //         if(err) {
  //           done(err);
  //         } else {
  //           done();
  //         }
  //       });
  //     }, [menuItem, ingredients]);
  //     expect(result.error).to.be.equal(404);
  //   });

  //   describe("with menu item", function() {
  //     it("without existing ingredients", function() {
  //       var info = {
  //         "name": "Burger" + Math.random(),
  //         "tag": "Kids menu",
  //         "prepItems": ["1", "3"],
  //         "shelfLife": 123,
  //         "instructions": "Heat before serve",
  //         "ingredients": [],
  //         "salesPrice": 60
  //       }
  //       var menuItem = server.execute(function(info) {
  //         return MenuItems.insert(info);
  //       }, [info]);
  //       expect(menuItem).to.be.not.equal(null);

  //       var ingredients = [
  //         {"id": 1, "quantity": '10g'},
  //         {"id": 2, "quantity": '100g'}
  //       ];

  //       var result = client.promise(function(done, error, menuItem, ingredients) {
  //         Meteor.call("addIngredients", menuItem, ingredients, function(err) {
  //           if(err) {
  //             done(err);
  //           } else {
  //             done();
  //           }
  //         });
  //       }, [menuItem, ingredients]);
  //       expect(result).to.be.equal(null);

  //       var check = server.execute(function(menuItem) {
  //         return MenuItems.findOne(menuItem);
  //       }, [menuItem]);
  //       expect(check.ingredients.length).to.be.equal(2);
  //     });

  //     it("with existing ingredients", function() {
  //       var info = {
  //         "name": "Burger" + Math.random(),
  //         "tag": "Kids menu",
  //         "prepItems": ["1", "3"],
  //         "shelfLife": 123,
  //         "instructions": "Heat before serve",
  //         "ingredients": [{"id": 1, "quantity": '10g'}],
  //         "salesPrice": 60
  //       }
  //       var menuItem = server.execute(function(info) {
  //         return MenuItems.insert(info);
  //       }, [info]);
  //       expect(menuItem).to.be.not.equal(null);

  //       var ingredients = [
  //         {"id": 2, "quantity": '100g'}
  //       ];

  //       var result = client.promise(function(done, error, menuItem, ingredients) {
  //         Meteor.call("addIngredients", menuItem, ingredients, function(err) {
  //           if(err) {
  //             done(err);
  //           } else {
  //             done();
  //           }
  //         });
  //       }, [menuItem, ingredients]);
  //       expect(result).to.be.equal(null);

  //       var check = server.execute(function(menuItem) {
  //         return MenuItems.findOne(menuItem);
  //       }, [menuItem]);
  //       expect(check.ingredients.length).to.be.equal(2);
  //     });


  //     it("with duplicated ingredients", function() {
  //       var info = {
  //         "name": "Burger" + Math.random(),
  //         "tag": "Kids menu",
  //         "prepItems": ["1", "3"],
  //         "shelfLife": 123,
  //         "instructions": "Heat before serve",
  //         "ingredients": [{"id": 1, "quantity": '10g'}, {"id": 2, "quantity": '10g'}],
  //         "salesPrice": 60
  //       }
  //       var menuItem = server.execute(function(info) {
  //         return MenuItems.insert(info);
  //       }, [info]);
  //       expect(menuItem).to.be.not.equal(null);

  //       var ingredients = [
  //         {"id": 2, "quantity": '100g'}
  //       ];
        
  //       var result = client.promise(function(done, error, menuItem, ingredients) {
  //         Meteor.call("addIngredients", menuItem, ingredients, function(err) {
  //           if(err) {
  //             done(err);
  //           } else {
  //             done();
  //           }
  //         });
  //       }, [menuItem, ingredients]);
  //       expect(result).to.be.equal(null);

  //       var check = server.execute(function(menuItem) {
  //         return MenuItems.findOne(menuItem);
  //       }, [menuItem]);
  //       expect(check.ingredients.length).to.be.equal(2);
  //     });
  //   });
  // });

  // describe("removeIngredients method", function() {
  //   it("without menu id", function() {
  //     var menuItem = "1";
  //     var ingredient = '1';

  //     var result = client.promise(function(done, error, menuItem, ingredient) {
  //       Meteor.call("removeIngredients", menuItem, ingredient, function(err) {
  //         if(err) {
  //           done(err);
  //         } else {
  //           done();
  //         }
  //       });
  //     }, [menuItem, ingredient]);
  //     expect(result.error).to.be.equal(404);
  //   });

  //   describe("with menu item", function() {
  //     it("without existing ingredients", function() {
  //       var ingredient = server.execute(function() {
  //         var info = {
  //           "code": "VV",
  //           "description": "Eggs"
  //         }
  //         return Ingredients.insert(info);
  //       });

  //       var info = {
  //         "name": "Burger" + Math.random(),
  //         "tag": "Kids menu",
  //         "prepItems": ["1", "3"],
  //         "shelfLife": 123,
  //         "instructions": "Heat before serve",
  //         "ingredients": [],
  //         "salesPrice": 60
  //       }
  //       var menuItem = server.execute(function(info) {
  //         return MenuItems.insert(info);
  //       }, [info]);
  //       expect(menuItem).to.be.not.equal(null);

  //       var result = client.promise(function(done, error, menuItem, ingredient) {
  //         Meteor.call("removeIngredients", menuItem, ingredient, function(err) {
  //           if(err) {
  //             done(err);
  //           } else {
  //             done();
  //           }
  //         });
  //       }, [menuItem, ingredient]);
  //       expect(result.error).to.be.equal(404);
  //     });

  //     it("with existing ingredients", function() {
  //       var ingredient = server.execute(function() {
  //         var info = {
  //           "code": "VV",
  //           "description": "Eggs"
  //         }
  //         return Ingredients.insert(info);
  //       });

  //       var info = {
  //         "name": "Burger" + Math.random(),
  //         "tag": "Kids menu",
  //         "prepItems": ["1", "3"],
  //         "shelfLife": 123,
  //         "instructions": "Heat before serve",
  //         "ingredients": [{"id": ingredient, "quantity": "10g"}],
  //         "salesPrice": 60
  //       }
  //       var menuItem = server.execute(function(info) {
  //         return MenuItems.insert(info);
  //       }, [info]);
  //       expect(menuItem).to.be.not.equal(null);

  //       var result = client.promise(function(done, error, menuItem, ingredient) {
  //         Meteor.call("removeIngredients", menuItem, ingredient, function(err) {
  //           if(err) {
  //             done(err);
  //           } else {
  //             done();
  //           }
  //         });
  //       }, [menuItem, ingredient]);
  //       expect(result).to.be.equal(null);

  //       var check = server.execute(function(menuItem) {
  //         return MenuItems.findOne(menuItem);
  //       }, [menuItem]);
  //       expect(check.ingredients.length).to.be.equal(0);
  //     });
  //   });
  // });

  // describe("addJobItems method", function() {
  //   it("without menu item", function() {
  //     var menuItem = "1";
  //     var jobItems = [{"id": "1", "quantity": "10g"}];

  //     var result = client.promise(function(done, error, menuItem, jobItems) {
  //       Meteor.call("addJobItems", menuItem, jobItems, function(err) {
  //         if(err) {
  //           done(err);
  //         } else {
  //           done();
  //         }
  //       });
  //     }, [menuItem, jobItems]);
  //     expect(result.error).to.be.equal(404);
  //   });

  //   describe("with menu item", function() {
  //     it("without existing jobItems", function() {
  //       var info = {
  //         "name": "Burger" + Math.random(),
  //         "tag": "Kids menu",
  //         "jobItems": [],
  //         "shelfLife": 123,
  //         "instructions": "Heat before serve",
  //         "ingredients": [],
  //         "salesPrice": 60
  //       }
  //       var menuItem = server.execute(function(info) {
  //         return MenuItems.insert(info);
  //       }, [info]);
  //       expect(menuItem).to.be.not.equal(null);

  //       var jobItems = [
  //         {"id": 1, "quantity": '10g'},
  //         {"id": 2, "quantity": '100g'}
  //       ];

  //       var result = client.promise(function(done, error, menuItem, jobItems) {
  //         Meteor.call("addJobItems", menuItem, jobItems, function(err) {
  //           if(err) {
  //             done(err);
  //           } else {
  //             done();
  //           }
  //         });
  //       }, [menuItem, jobItems]);
  //       expect(result).to.be.equal(null);

  //       var check = server.execute(function(menuItem) {
  //         return MenuItems.findOne(menuItem);
  //       }, [menuItem]);
  //       expect(check.jobItems.length).to.be.equal(2);
  //     });

  //     it("with existing jobItems", function() {
  //       var info = {
  //         "name": "Burger" + Math.random(),
  //         "tag": "Kids menu",
  //         "jobItems": [{"id": 1, "quantity": 10}],
  //         "shelfLife": 123,
  //         "instructions": "Heat before serve",
  //         "ingredients": [{"id": 1, "quantity": '10g'}],
  //         "salesPrice": 60
  //       }
  //       var menuItem = server.execute(function(info) {
  //         return MenuItems.insert(info);
  //       }, [info]);
  //       expect(menuItem).to.be.not.equal(null);

  //       var jobItems = [
  //         {"id": 2, "quantity": '100g'}
  //       ];

  //       var result = client.promise(function(done, error, menuItem, jobItems) {
  //         Meteor.call("addJobItems", menuItem, jobItems, function(err) {
  //           if(err) {
  //             done(err);
  //           } else {
  //             done();
  //           }
  //         });
  //       }, [menuItem, jobItems]);
  //       expect(result).to.be.equal(null);

  //       var check = server.execute(function(menuItem) {
  //         return MenuItems.findOne(menuItem);
  //       }, [menuItem]);
  //       expect(check.jobItems.length).to.be.equal(2);
  //     });


  //     it("with duplicated jobItems", function() {
  //       var info = {
  //         "name": "Burger" + Math.random(),
  //         "tag": "Kids menu",
  //         "jobItems": [{"id": 2, "quantity": '10g'}],
  //         "shelfLife": 123,
  //         "instructions": "Heat before serve",
  //         "ingredients": [{"id": 1, "quantity": '10g'}, {"id": 2, "quantity": '10g'}],
  //         "salesPrice": 60
  //       }
  //       var menuItem = server.execute(function(info) {
  //         return MenuItems.insert(info);
  //       }, [info]);
  //       expect(menuItem).to.be.not.equal(null);

  //       var jobItems = [
  //         {"id": 2, "quantity": '100g'}
  //       ];
        
  //       var result = client.promise(function(done, error, menuItem, jobItems) {
  //         Meteor.call("addJobItems", menuItem, jobItems, function(err) {
  //           if(err) {
  //             done(err);
  //           } else {
  //             done();
  //           }
  //         });
  //       }, [menuItem, jobItems]);
  //       expect(result).to.be.equal(null);

  //       var check = server.execute(function(menuItem) {
  //         return MenuItems.findOne(menuItem);
  //       }, [menuItem]);
  //       expect(check.jobItems.length).to.be.equal(1);
  //     });
  //   });
  // });
});