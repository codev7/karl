var server = meteor({flavor: "fiber"});
var client = browser({flavor: "fiber", location: server});

describe("Assign workers to shifts - assignWorker method", function() {
  describe("With shift id", function() {
    // it("Passed shift date", function() {
    //   var workerId = server.execute(function() {
    //     var info = {
    //       "name": "test worker",
    //       "type": "chef",
    //       "wage": "100",
    //       "workLimit": 10,
    //       "resign": false
    //     }
    //     return (Workers.insert(info));
    //   });

    //   var shiftId = server.execute(function() {
    //     var info = {
    //       "shiftDate": "2015-01-12",
    //       "startTime": "8.00",
    //       "endTime": "5.00",
    //       "assignedTo": null,
    //       "jobs": []
    //     }
    //     return (Shifts.insert(info));
    //   });

    //   var result = client.promise(function(done, error, workerId, shiftId) {
    //     Meteor.call("assignWorker", workerId, shiftId, function(err) {
    //       if(err) {
    //         done(err);
    //       } else {
    //         done();
    //       }
    //     });
    //   }, [workerId, shiftId]);
    //   expect(result.error).to.be.equal(404);
    // });

    describe("Future shift date", function() {
      describe("With worker id", function() {
        it("Shift already assigned", function() {
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

          var shiftId = server.execute(function() {
            var info = {
              "shiftDate": "2020-01-12",
              "startTime": "8.00",
              "endTime": "5.00",
              "assignedTo": "workerId",
              "jobs": []
            }
            return (Shifts.insert(info));
          });

          var result = client.promise(function(done, error, workerId, shiftId) {
            Meteor.call("assignWorker", workerId, shiftId, function(err) {
              if(err) {
                done(err);
              } else {
                done();
              }
            });
          }, [workerId, shiftId]);
          expect(result).to.be.equal(null);

          var checkShift = server.execute(function(shiftId) {
            var doc = Shifts.findOne(shiftId);
            return doc;
          }, [shiftId]);
          expect(checkShift.assignedTo).to.be.equal(workerId);
        });

        it("Shift not assigned", function() {
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

          var shiftId = server.execute(function() {
            var info = {
              "shiftDate": "2020-01-12",
              "startTime": "8.00",
              "endTime": "5.00",
              "assignedTo": null,
              "jobs": []
            }
            return (Shifts.insert(info));
          });

          var result = client.promise(function(done, error, workerId, shiftId) {
            Meteor.call("assignWorker", workerId, shiftId, function(err) {
              if(err) {
                done(err);
              } else {
                done();
              }
            });
          }, [workerId, shiftId]);
          expect(result).to.be.equal(null);

          var checkShift = server.execute(function(shiftId) {
            var doc = Shifts.findOne(shiftId);
            return doc;
          }, [shiftId]);
          expect(checkShift.assignedTo).to.be.equal(workerId);
        });
      });

      it("Without worker id", function() {
        var shiftId = server.execute(function() {
          var info = {
            "shiftDate": "2020-01-12",
            "startTime": "8.00",
            "endTime": "5.00",
            "assignedTo": "workerId",
            "jobs": []
          }
          return (Shifts.insert(info));
        });

        var result = client.promise(function(done, error, workerId, shiftId) {
          Meteor.call("assignWorker", workerId, shiftId, function(err) {
            if(err) {
              done(err);
            } else {
              done();
            }
          });
        }, [null, shiftId]);
        expect(result).to.be.equal(null);

        var checkShift = server.execute(function(shiftId) {
          var doc = Shifts.findOne(shiftId);
          return doc;
        }, [shiftId]);
        expect(checkShift.assignedTo).to.be.equal(null);
      });
    });
  });
});


describe("Assign jobs to shifts - assignJob method", function() {
  // it("Shift on past date", function() {
  //   var jobId = server.execute(function() {
  //     var info = {
  //       "name": "Job 1",
  //       "status": "draft",
  //       "type": "Prep",
  //       "onshift": null
  //     }
  //     return(Jobs.insert(info));
  //   });
  //   expect(jobId).to.not.be.equal(null);

  //   var shiftId = server.execute(function() {
  //     var info = {
  //       "shiftDate": "2015-01-12",
  //       "startTime": "8.00",
  //       "endTime": "5.00",
  //       "jobs": ["job1"]
  //     }
  //     return(Shifts.insert(info));
  //   });
  //   expect(shiftId).to.not.be.equal(null);
    
  //   var result = client.promise(function(done, error, jobId, shiftId) {
  //     Meteor.call("assignJob", jobId, shiftId, function(err) {
  //       if(err) {
  //         done(err);
  //       } else {
  //         done();
  //       }
  //     });
  //   }, [jobId, shiftId]);
  //   expect(result).to.not.be.equal(null);

  //  var job = server.execute(function(jobId) {
  //     var doc = Jobs.findOne(jobId)
  //     return doc;
  //   }, [jobId]);
  //   expect(job.onshift).to.be.equal(null);

  //   var shift = server.execute(function(id) {
  //     var doc = Shifts.findOne(id)
  //     return doc;
  //   }, [shiftId]);
  //   expect(shift.jobs.length).to.be.equal(1);
  // });

  describe("Shift on future date", function() {
    describe("Assigning", function() {
      it("Not assigned", function() {
        var jobId = server.execute(function() {
          var info = {
            "name": "Job 1",
            "status": "draft",
            "type": "Prep"
          }
          return(Jobs.insert(info));
        });
        expect(jobId).to.not.be.equal(null);

        var shiftId = server.execute(function() {
          var info = {
            "shiftDate": "2020-01-12",
            "startTime": "8.00",
            "endTime": "5.00",
            "jobs": ["job1"]
          }
          return(Shifts.insert(info));
        });
        expect(shiftId).to.not.be.equal(null);

        var result = client.promise(function(done, error, jobId, shiftId) {
          Meteor.call("assignJob", jobId, shiftId, function(err) {
            if(err) {
              done(err);
            } else {
              done();
            }
          });
        }, [jobId, shiftId]);
        expect(result).to.be.equal(null);

        var job = server.execute(function(jobId) {
          var doc = Jobs.findOne(jobId)
          return doc;
        }, [jobId]);
        expect(job.onshift).to.be.equal(shiftId);

        var shift = server.execute(function(id) {
          var doc = Shifts.findOne(id)
          return doc;
        }, [shiftId]);
        expect(shift.jobs.length).to.be.equal(2);
      });

      it("Already assigned", function() {
        var shiftId_assigned = server.execute(function() {
          var info = {
            "shiftDate": "2020-01-12",
            "startTime": "8.00",
            "endTime": "5.00",
            "jobs": ["job1"]
          }
          return(Shifts.insert(info));
        });
        expect(shiftId_assigned).to.not.be.equal(null);

        var jobId = server.execute(function(shiftId_assigned) {
          var info = {
            "name": "Job 1",
            "status": "assigned",
            "type": "Prep",
            "onshift": shiftId_assigned
          }
          return(Jobs.insert(info));
        }, [shiftId_assigned]);
        expect(jobId).to.not.be.equal(null);

        var shiftId_to_be_assigned = server.execute(function() {
          var info = {
            "shiftDate": "2020-01-12",
            "startTime": "8.00",
            "endTime": "5.00",
            "jobs": ["job1"]
          }
          return(Shifts.insert(info));
        });
        expect(shiftId_to_be_assigned).to.not.be.equal(null);

        var result = client.promise(function(done, error, jobId, shiftId) {
          Meteor.call("assignJob", jobId, shiftId, function(err) {
            if(err) {
              done(err);
            } else {
              done();
            }
          });
        }, [jobId, shiftId_to_be_assigned]);
        expect(result).to.be.equal(null);

        var job = server.execute(function(jobId) {
          var doc = Jobs.findOne(jobId)
          return doc;
        }, [jobId]);
        expect(job.onshift).to.be.equal(shiftId_to_be_assigned);

        var previous_shift = server.execute(function(id) {
          var doc = Shifts.findOne(id)
          return doc;
        }, [shiftId_assigned]);
        expect(previous_shift.jobs.length).to.be.equal(1);

        var current_shift = server.execute(function(id) {
          var doc = Shifts.findOne(id)
          return doc;
        }, [shiftId_to_be_assigned]);
        expect(current_shift.jobs.length).to.be.equal(2);
      });

      it("Already started", function() {
        var shiftId_assigned = server.execute(function() {
          var info = {
            "shiftDate": "2020-01-12",
            "startTime": "8.00",
            "endTime": "5.00",
            "jobs": ["job1"]
          }
          return(Shifts.insert(info));
        });
        expect(shiftId_assigned).to.not.be.equal(null);

        var jobId = server.execute(function(shiftId_assigned) {
          var info = {
            "name": "Job 1",
            "status": "started",
            "type": "Prep",
            "onshift": shiftId_assigned
          }
          return(Jobs.insert(info));
        }, [shiftId_assigned]);
        expect(jobId).to.not.be.equal(null);

        var shiftId_to_be_assigned = server.execute(function() {
          var info = {
            "shiftDate": "2020-01-12",
            "startTime": "8.00",
            "endTime": "5.00",
            "jobs": ["job1"]
          }
          return(Shifts.insert(info));
        });
        expect(shiftId_to_be_assigned).to.not.be.equal(null);

        var result = client.promise(function(done, error, jobId, shiftId) {
          Meteor.call("assignJob", jobId, shiftId, function(err) {
            if(err) {
              done(err);
            } else {
              done();
            }
          });
        }, [jobId, shiftId_to_be_assigned]);
        expect(result.error).to.be.equal(404);

        var job = server.execute(function(jobId) {
          var doc = Jobs.findOne(jobId)
          return doc;
        }, [jobId]);
        expect(job.onshift).to.be.equal(shiftId_assigned);

        var current_shift = server.execute(function(id) {
          var doc = Shifts.findOne(id)
          return doc;
        }, [shiftId_to_be_assigned]);
        expect(current_shift.jobs.length).to.be.equal(1);
      });
    });

    describe("Removing", function() {
      it("Already assigned", function() {
        var shiftId_assigned = server.execute(function() {
          var info = {
            "shiftDate": "2020-01-12",
            "startTime": "8.00",
            "endTime": "5.00",
            "jobs": ["job1"]
          }
          return(Shifts.insert(info));
        });
        expect(shiftId_assigned).to.not.be.equal(null);

        var jobId = server.execute(function(shiftId_assigned) {
          var info = {
            "name": "Job 1",
            "status": "assigned",
            "type": "Prep",
            "onshift": shiftId_assigned
          }
          return(Jobs.insert(info));
        }, [shiftId_assigned]);
        expect(jobId).to.not.be.equal(null);
        
        var result = client.promise(function(done, error, jobId, shiftId) {
          Meteor.call("assignJob", jobId, shiftId, function(err) {
            if(err) {
              done(err);
            } else {
              done();
            }
          });
        }, [jobId, null]);
        expect(result).to.be.equal(null);

        var job = server.execute(function(jobId) {
          var doc = Jobs.findOne(jobId)
          return doc;
        }, [jobId]);
        expect(job.onshift).to.be.equal(null);
      });

      it("Already started", function() {
        var shiftId_assigned = server.execute(function() {
          var info = {
            "shiftDate": "2020-01-12",
            "startTime": "8.00",
            "endTime": "5.00",
            "jobs": ["job1"]
          }
          return(Shifts.insert(info));
        });
        expect(shiftId_assigned).to.not.be.equal(null);

        var jobId = server.execute(function(shiftId_assigned) {
          var info = {
            "name": "Job 1",
            "status": "started",
            "type": "Prep",
            "onshift": shiftId_assigned
          }
          return(Jobs.insert(info));
        }, [shiftId_assigned]);
        expect(jobId).to.not.be.equal(null);
        
        var result = client.promise(function(done, error, jobId, shiftId) {
          Meteor.call("assignJob", jobId, shiftId, function(err) {
            if(err) {
              done(err);
            } else {
              done();
            }
          });
        }, [jobId, null]);
        expect(result.error).to.be.equal(404);

        var job = server.execute(function(jobId) {
          var doc = Jobs.findOne(jobId)
          return doc;
        }, [jobId]);
        expect(job.onshift).to.be.equal(shiftId_assigned);
      });

    });
  }); 
});