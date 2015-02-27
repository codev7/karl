var server = meteor({flavor: "fiber"});
var client = browser({flavor: "fiber", location: server});

describe("Testing menu related methods", function() {
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