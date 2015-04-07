var server = meteor({flavor: "fiber"});
var client = browser({flavor: "fiber", location: server});

createCommentMethod = function(done, error, text, ref) {
  Meteor.call("createComment", text, ref, function(err, id) {
    if(err) {
      done(err);
    } else {
      done(id);
    }
  });
}

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


describe("Testing comments related methods", function() {
  describe("createComment method", function() {
    it("Without logged in user", function() {
      var userErr = client.logout();
     
      var text = "Commenting on menu";
      var ref = server.execute(createNewMenuItem);

      var result = client.promise(createCommentMethod, [text, ref]);
      expect(result.error).to.be.equal(401);
    });

    it("With logged in user", function() {
      // var username = 'user' + Math.random();
      // var userErr = client.signUp({
      //   'username': username, 
      //   'password': username
      // });
      // var loggedInUser = client.execute(function() {
      //   return Meteor.user();
      // });
      // expect(loggedInUser).to.be.not.equal(null);
      // var loggedInUserId = loggedInUser._id;
      // console.log(loggedInUserId);

      // var promote = server.execute(function(userId) {
      //   Meteor.users.update({'_id': userId}, {$set: {"isAdmin": true}});
      //   return;
      // }, [loggedInUserId]);
  
      var text = "Commenting on menu";
      var ref = server.execute(createNewMenuItem);

      var result = client.promise(createCommentMethod, [text, ref]);
      console.log(result);
      expect(result.error).to.be.equal(401);
    });
  });
});