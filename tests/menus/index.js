var server = meteor({flavor: "fiber"});
var client = browser({flavor: "fiber", location: server});

describe("Testing menu related methods", function() {
  it("without name", function() {
    var info = {
      "tag": "kids",
      "instructions": "Cook"
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
      "tag": "kids",
      "name": "Sandwitch"
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
    expect(result).not.to.be.equal(null);
  });
});