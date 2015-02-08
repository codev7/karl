var server = meteor({flavor: "fiber"});
var client = browser({flavor: "fiber", location: server});

describe("Testing worker methods", function() {
  describe("Create worker - createWorker method", function() {
    it("Create new worker", function() {
      var info = {
        "name": "test worker",
        "type": "chef",
        "wage": "100",
        "workLimit": 10
      }
      var result = client.promise(function(done, error, info) {
        Meteor.call("createWorker", info, function(err, id) {
          if(err) {
            done(err);
          } else {
            done(id);
          }
        });
      }, [info]);
      expect(result).to.not.be.equal(null);

      var worker = server.execute(function(id) {
        var doc = Workers.findOne(id);
        return (doc);
      }, [result]);
      expect(worker._id).to.be.equal(result);
    });
  });

  describe("Edit worker - editWorker method", function() {
    it("Change fields", function() {
      var workerId = server.execute(function() {
        var info = {
          "name": "test worker",
          "type": "chef",
          "wage": "100",
          "workLimit": 10
        }
        return (Workers.insert(info));
      });

      var editDoc = {
        "_id": workerId,
        "name": "Testing worker",
        "type": "waiter"
      }
      var result = client.promise(function(done, error, editDoc) {
        Meteor.call("editWorker", editDoc, function(err, id) {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      }, [editDoc]);
      expect(result).to.be.equal(null);
      
      var worker = server.execute(function(id) {
        var doc = Workers.findOne(id);
        return doc;
      }, [workerId]);
      expect(worker.name).to.be.not.equal("test worker");
      expect(worker.name).to.be.equal(editDoc.name);      
    });   
  });

  describe("Delete Worker - deleteWorker method", function() {
    it("Already resigned worker", function() {
      var workerId = server.execute(function() {
        var info = {
          "name": "test worker",
          "type": "chef",
          "wage": "100",
          "workLimit": 10,
          "resign": true
        }
        return (Workers.insert(info));
      });

      var result = client.promise(function(done, error, id) {
        Meteor.call("deleteWorker", id, function(err) {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      }, [workerId]);
      expect(result.error).to.be.equal(404);
    });

    describe("Active worker", function() {
      it("No records of work", function() {
        var workerId = server.execute(function() {
          var info = {
            "name": "test worker",
            "type": "chef",
            "wage": "100",
            "workLimit": 10,
            "resign": false
          }
          return (Workers.insert(info));
        });

        var result = client.promise(function(done, error, id) {
          Meteor.call("deleteWorker", id, function(err) {
            if(err) {
              done(err);
            } else {
              done();
            }
          });
        }, [workerId]);
        expect(result).to.be.equal(null);

        var worker = server.execute(function(id) {
          var doc = Workers.findOne(id);
          return doc;
        }, [workerId]);
        expect(worker).to.be.equal(undefined);
      });

      it("Has past records of working", function() {
        var workerId = server.execute(function() {
          var info = {
            "name": "test worker",
            "type": "chef",
            "wage": "100",
            "workLimit": 10,
            "resign": false
          }
          return (Workers.insert(info));
        });

        var shiftId = server.execute(function(workerId) {
          var info = {
            "shiftDate": "2015-01-12",
            "startTime": "8.00",
            "endTime": "5.00",
            "assignedTo": workerId,
            "jobs": []
          }
          return (Shifts.insert(info));
        }, [workerId]);

        var result = client.promise(function(done, error, id) {
          Meteor.call("deleteWorker", id, function(err) {
            if(err) {
              done(err);
            } else {
              done();
            }
          });
        }, [workerId]);
        expect(result).to.be.equal(null);

        var worker = server.execute(function(id) {
          var doc = Workers.findOne(id);
          return doc;
        }, [workerId]);
        expect(worker._id).to.be.equal(workerId);
        expect(worker.resign).to.be.equal(true);

        var checkShift = server.execute(function(shiftId) {
          var doc = Shifts.findOne(shiftId);
          return doc;
        }, [shiftId]);
        expect(checkShift.assignedTo).to.be.equal(workerId);
      });

      it("Has future records for working", function() {
        var workerId = server.execute(function() {
          var info = {
            "name": "test worker",
            "type": "chef",
            "wage": "100",
            "workLimit": 10,
            "resign": false
          }
          return (Workers.insert(info));
        });

        var shiftId = server.execute(function(workerId) {
          var info = {
            "shiftDate": "2020-01-12",
            "startTime": "8.00",
            "endTime": "5.00",
            "assignedTo": workerId,
            "jobs": []
          }
          return (Shifts.insert(info));
        }, [workerId]);

        var result = client.promise(function(done, error, id) {
          Meteor.call("deleteWorker", id, function(err) {
            if(err) {
              done(err);
            } else {
              done();
            }
          });
        }, [workerId]);
        expect(result).to.be.equal(null);

        var worker = server.execute(function(id) {
          var doc = Workers.findOne(id);
          return doc;
        }, [workerId]);
        expect(worker._id).to.be.equal(workerId);
        expect(worker.resign).to.be.equal(true);

        var checkShift = server.execute(function(shiftId) {
          var doc = Shifts.findOne(shiftId);
          return doc;
        }, [shiftId]);
        expect(checkShift.assignedTo).to.be.equal(null);
      });
    });
  });

  describe("Set leave for worker - setLeave method", function() {
    it("Past date", function() {
      var workerId = server.execute(function() {
        var info = {
          "name": "test worker",
          "type": "chef",
          "wage": "100",
          "workLimit": 10,
          "resign": true
        }
        return (Workers.insert(info));
      });

      var date = "2014-01-01";
      var onHoliday = true;
      var result = client.promise(function(done, error, workerId, date, onHoliday) {
        Meteor.call("setLeave", workerId, date, onHoliday, function(err) {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      }, [workerId, date, onHoliday]);
      expect(result.error).to.be.equal(404);
    });

    describe("Future date", function() {
      describe("Add holiday", function() {
        it("if assigned to a shift", function() {
          var workerId = server.execute(function() {
            var info = {
              "name": "test worker",
              "type": "chef",
              "wage": "100",
              "workLimit": 10,
              "resign": true
            }
            return (Workers.insert(info));
          });

          var date = "2020-01-01";
          var onHoliday = true;

          var shiftId = server.execute(function(workerId, date) {
            var info = {
              "shiftDate": date,
              "startTime": "8.00",
              "endTime": "5.00",
              "assignedTo": workerId,
              "jobs": []
            }
            return (Shifts.insert(info));
          }, [workerId, date]);

          var result = client.promise(function(done, error, workerId, date, onHoliday) {
            Meteor.call("setLeave", workerId, date, onHoliday, function(err) {
              if(err) {
                done(err);
              } else {
                done();
              }
            });
          }, [workerId, date, onHoliday]);
          expect(result.error).to.be.equal(404);

          var checkShift = server.execute(function(shiftId) {
            var doc = Shifts.findOne(shiftId);
            return doc;
          }, [shiftId]);
          expect(checkShift.assignedTo).to.be.equal(workerId);
        });

        it("no assigned shifts", function() {
          var workerId = server.execute(function() {
            var info = {
              "name": "test worker",
              "type": "chef",
              "wage": "100",
              "workLimit": 10,
              "resign": true
            }
            return (Workers.insert(info));
          });

          var date = "2020-01-01";
          var onHoliday = true;

          var result = client.promise(function(done, error, workerId, date, onHoliday) {
            Meteor.call("setLeave", workerId, date, onHoliday, function(err) {
              if(err) {
                done(err);
              } else {
                done();
              }
            });
          }, [workerId, date, onHoliday]);
          expect(result).to.be.equal(null);

          var holiday = server.execute(function(date) {
            var doc = Holidays.findOne({"date": date});
            return doc;
          }, [date]);
          expect(holiday.workers[0]).to.be.equal(workerId);
        });
      });

      it("Remove holiday", function() {
        var workerId = server.execute(function() {
          var info = {
            "name": "test worker",
            "type": "chef",
            "wage": "100",
            "workLimit": 10,
            "resign": true
          }
          return (Workers.insert(info));
        });

        var date = "2020-01-01";
        var onHoliday = false;

        var holiday_before = server.execute(function(date, workerId) {
          var doc = {
            "date": date,
            "workers": [workerId]
          }
          Holidays.insert(doc);
          return doc;
        }, [date, workerId]);
        expect(holiday_before.workers[0]).to.be.equal(workerId);

        var result = client.promise(function(done, error, workerId, date, onHoliday) {
          Meteor.call("setLeave", workerId, date, onHoliday, function(err) {
            if(err) {
              done(err);
            } else {
              done();
            }
          });
        }, [workerId, date, onHoliday]);
        expect(result).to.be.equal(null);

        var holiday_after = server.execute(function(date) {
          var doc = Holidays.findOne({"date": date});
          return doc;
        }, [date, workerId]);
        expect(holiday_after.workers.length).to.be.equal(0);
      });
    });
  });
});