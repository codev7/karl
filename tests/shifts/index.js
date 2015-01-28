var server = meteor({flavor: "fiber"});
var client = browser({flavor: "fiber", location: server});

describe("Testing shift methods", function() {
  describe("Create shift - createShift method", function() {
    it("Shift date (previous)", function() {
      var info = {
        "startTime": "8.00",
        "endTime": "17.00",
        "shiftDate": "2014-02-16",
      }

      var result = client.promise(function(done, error, info) {
        Meteor.call("createShift", info, function(err, id) {
          if(err) {
            done(err);
          } else {
            done(id);
          }
        });
      }, [info]);
      expect(result.error).to.be.equal(404);
    });

    it("Shift date (future)", function() {
      var info = {
        "startTime": "8.00",
        "endTime": "17.00",
        "shiftDate": "2020-02-16",
      }

      var result = client.promise(function(done, error, info) {
        Meteor.call("createShift", info, function(err, id) {
          if(err) {
            done(err);
          } else {
            done(id);
          }
        });
      }, [info]);
      expect(result).to.not.be.equal(null);

      var shift = server.execute(function() {
        var doc = Shifts.findOne();
        return (doc);
      }, [result]);
      expect(shift._id).to.be.equal(result);
    });   
  });

  describe("Edit shift - editShift method", function() {
    it("Shift date (previous)", function() {
      var shiftId = server.execute(function() {
        var info = {
          "startTime": "8.00",
          "endTime": "17.00",
          "shiftDate": "2015-01-16",
          "assignedTo": null,
          "jobs": []
        }
        return(Shifts.insert(info));
      });

      var editDoc = {
        "_id": shiftId,
        "startTime": "9.00"
      }
      var result = client.promise(function(done, error, editDoc) {
        Meteor.call("editShift", editDoc, function(err) {
          if(err) {
            done(err)
          } else {
            done();
          }
        });
      }, [editDoc]);
      expect(result.error).to.be.equal(404);
    });

    describe("Shift date (future)", function() {
      it("assigned to worker", function() {
        var shiftId = server.execute(function() {
          var info = {
            "startTime": "8.00",
            "endTime": "17.00",
            "shiftDate": "2020-01-20",
            "assignedTo": "worker",
            "jobs": []
          }
          return(Shifts.insert(info));
        });
        var editDoc = {
          "_id": shiftId,
          "startTime": "9.00"
        }
        var result = client.promise(function(done, error, editDoc) {
          Meteor.call("editShift", editDoc, function(err) {
            if(err) {
              done(err)
            } else {
              done();
            }
          }); 
        }, [editDoc]);
        expect(result.error).to.be.equal(404);
      });

      it("assigned jobs", function() {
        var shiftId = server.execute(function() {
          var info = {
            "startTime": "8.00",
            "endTime": "17.00",
            "shiftDate": "2020-01-20",
            "assignedTo": null,
            "jobs": ["job1", "job2"]
          }
          return(Shifts.insert(info));
        });
        var editDoc = {
          "_id": shiftId,
          "startTime": "9.00"
        }
        var result = client.promise(function(done, error, editDoc) {
          Meteor.call("editShift", editDoc, function(err) {
            if(err) {
              done(err)
            } else {
              done();
            }
          });
        }, [editDoc]);
        expect(result.error).to.be.equal(404);
      });

      it("assigned jobs", function() {
        var shiftId = server.execute(function() {
          var info = {
            "startTime": "8.00",
            "endTime": "17.00",
            "shiftDate": "2020-01-20",
            "assignedTo": null,
            "jobs": []
          }
          return(Shifts.insert(info));
        });
        var editDoc = {
          "_id": shiftId,
          "startTime": "9.00"
        }
        var result = client.promise(function(done, error, editDoc) {
          Meteor.call("editShift", editDoc, function(err) {
            if(err) {
              done(err)
            } else {
              done();
            }
          });
        }, [editDoc]);
        expect(result).to.be.equal(null);

        var shift = server.execute(function(id) {
          var doc = Shifts.findOne(id);
          return doc;
        }, [shiftId]);
        expect(shift.startTime).to.be.equal(editDoc.startTime);
      });
    });
  });

  describe("Delete shift - deleteShift method", function() {
    it("Shift date (previous)", function() {
      var shiftId = server.execute(function() {
        var info = {
          "startTime": "8.00",
          "endTime": "17.00",
          "shiftDate": "2015-01-16",
          "assignedTo": null,
          "jobs": []
        }
        return(Shifts.insert(info));
      });

      var result = client.promise(function(done, error, id) {
        Meteor.call("deleteShift", id, function(err) {
          if(err) {
            done(err)
          } else {
            done();
          }
        });
      }, [shiftId]);
      expect(result.error).to.be.equal(404);
    });

    describe("Shift date (future)", function() {
      it("Assigned to worker", function() {
        var shiftId = server.execute(function() {
          var info = {
            "startTime": "8.00",
            "endTime": "17.00",
            "shiftDate": "2020-01-16",
            "assignedTo": "worker",
            "jobs": []
          }
          return(Shifts.insert(info));
        });

        var result = client.promise(function(done, error, id) {
          Meteor.call("deleteShift", id, function(err) {
            if(err) {
              done(err)
            } else {
              done();
            }
          });
        }, [shiftId]);
        expect(result.error).to.be.equal(404);
      });

      it("Assigned jobs", function() {
        var shiftId = server.execute(function() {
          var info = {
            "startTime": "8.00",
            "endTime": "17.00",
            "shiftDate": "2020-01-16",
            "assignedTo": null,
            "jobs": ["job1", "job2"]
          }
          return(Shifts.insert(info));
        });

        var result = client.promise(function(done, error, id) {
          Meteor.call("deleteShift", id, function(err) {
            if(err) {
              done(err)
            } else {
              done();
            }
          });
        }, [shiftId]);
        expect(result.error).to.be.equal(404);
      });

      it("Shift deleted", function() {
        var shiftId = server.execute(function() {
          var info = {
            "startTime": "8.00",
            "endTime": "17.00",
            "shiftDate": "2020-01-16",
            "assignedTo": null,
            "jobs": []
          }
          return(Shifts.insert(info));
        });

        var result = client.promise(function(done, error, id) {
          Meteor.call("deleteShift", id, function(err) {
            if(err) {
              done(err)
            } else {
              done();
            }
          });
        }, [shiftId]);
        expect(result).to.be.equal(null);
      });
    });
  });
});