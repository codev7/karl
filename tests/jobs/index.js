var server = meteor({flavor: "fiber"});
var client = browser({flavor: "fiber", location: server});

describe("Testing job methods", function() {
  describe("generateJobs method", function() {
    it("generating jobs", function() {
      var jobItemId1 = server.execute(function() {
        var info = {
          "name": "jobItem1",
          "type": "prep",
          "ingredients": [{"id": 1, "quantity": 10}],
          "portions": 10,
          "activeTime": 100
        }
        var id = JobItems.insert(info);
        return id;
      });
      console.log("jobItem...", jobItemId1);

      var jobItemId2 = server.execute(function() {
        var info = {
          "name": "jobItem2",
          "type": "prep",
          "ingredients": [{"id": 1, "quantity": 10}],
          "portions": 10,
          "activeTime": 200
        }
        var id = JobItems.insert(info);
        return id;
      });
      console.log("jobItem...", jobItemId2);

      var menuItemId1 = server.execute(function(jobItemId1, jobItemId2) {
        var info = {
          "name": "menu1",
          "tag": "Kids menu",
          "instructions": "Do the thing",
          "salesPrice": 100,
          "ingredients": [{"id": 1, "quantity": 10}],
          "jobItems": [{"id": jobItemId1, "quantity": 1}, {"id": jobItemId2, "quantity": 1}]
        }
        var id = MenuItems.insert(info);
        return id;
      }, [jobItemId1, jobItemId2]);
      console.log("menuItem1...", menuItemId1);

      var menuItemId2 = server.execute(function(jobItemId1, jobItemId2) {
        var info = {
          "name": "menu2",
          "tag": "Kids menu",
          "instructions": "Do the thing",
          "salesPrice": 100,
          "ingredients": [{"id": 1, "quantity": 10}],
          "jobItems": [{"id": jobItemId1, "quantity": 1}]
        }
        var id = MenuItems.insert(info);
        return id;
      }, [jobItemId1, jobItemId2]);
      console.log("menuItem2...", menuItemId2);

      var menuInfo = [{"id": menuItemId1, "quantity": 100}, {"id": menuItemId2, "quantity": 10}];

      var generatedJobs = client.promise(function(done, error, menuInfo) {
        var jobs = Meteor.call("generateJobs", menuInfo, new Date(), function(err, result) {
          if(err) {
            done(err);
          } else {
            done(result);
          }
        });
      }, [menuInfo]);
      console.log("method result...", generatedJobs);

      var job = server.execute(function(generatedJobs) {
        var doc = [];
        generatedJobs.forEach(function(id) {
          doc.push(Jobs.findOne(id));   
        });
        return doc;
      }, [generatedJobs]);
      console.log("..........................", job);

    });
  });
});