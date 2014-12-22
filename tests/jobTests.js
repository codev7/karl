var assert = require("assert");
// var common = require("common.js");

suite("Testing jobs", function() {
  test("Create jobs - createJob method", function(done, server, client) {
    var info = {
      "name": "job 1",
      "activeTime": 12,
      "details": "details",
      "image": "/image.jpg",
      "portions": 10,
      "ingCost": "$12",
      "shelfLife": "2"
    }
    var jobId = client.evalSync(function(info) {
      Meteor.call("createJob", info, function(err, id) {
        emit('return', {"err": err, "id": id});
      });
    }, info);

    var job = server.evalSync(getJob, jobId.id);
    assert.equal(jobId.err, null);
    assert.ok(jobId.id);
    done();
  });
});

suite("Assign jobs to shifts or remove from shifts - assignJobToShift method", function() {
  suite("with shift Id - assignning", function() {
    suite("without onShift - moving to a shift", function() {
      test("with state 'draft'", function(done, server, client) {
        var jobId = server.evalSync(insertJob);
        var shiftId = server.evalSync(insertShift);
        var jobBefore = server.evalSync(getJob, jobId);
        assert.equal(jobBefore.onshift, null);
        assert.equal(jobBefore.status, 'draft');

        var assign = client.evalSync(assignJobToShiftMethod, jobId, shiftId);
        assert.equal(assign, null)

        var jobAfter = server.evalSync(getJob, jobId);
        assert.equal(jobBefore._id, jobAfter._id);
        assert.equal(jobAfter.onshift, shiftId);
        assert.equal(jobAfter.status, 'assigned');
        done();
      }); 
    })

    suite("with onShift - moving within shifts", function() {
      test("with state 'assigned'", function(done, server, client) {
        var jobId = server.evalSync(insertJob);
        var shiftBefore = server.evalSync(insertShift);
        var shiftAfter = server.evalSync(insertShift);

        server.evalSync(updateJob, jobId, 'onshift', shiftBefore);
        server.evalSync(updateJob, jobId, 'status', 'assigned');
        
        var jobBefore = server.evalSync(getJob, jobId);
        assert.equal(jobBefore.onshift, shiftBefore);
        assert.equal(jobBefore.status, 'assigned');

        var assign = client.evalSync(assignJobToShiftMethod, jobId, shiftAfter);
        assert.equal(assign, null);

        var jobAfter = server.evalSync(getJob, jobId);
        assert.equal(jobBefore._id, jobAfter._id);
        assert.notEqual(jobBefore.onshift, jobAfter.onshift);
        assert.equal(jobAfter.status, 'assigned');
        done();
      });

      test("without state 'assigned'", function(done, server, client) {
        var jobId = server.evalSync(insertJob);
        var shiftBefore = server.evalSync(insertShift);
        var shiftAfter = server.evalSync(insertShift);

        server.evalSync(updateJob, jobId, 'onshift', shiftBefore);
        server.evalSync(updateJob, jobId, 'status', 'finished');
        
        var jobBefore = server.evalSync(getJob, jobId);
        assert.equal(jobBefore.onshift, shiftBefore);
        assert.equal(jobBefore.status, 'finished');

        var assign = client.evalSync(assignJobToShiftMethod, jobId, shiftAfter);
        assert.equal(assign.error, 404);
        done();
      });  
    });
  });

  suite("without shift Id", function() {
    test("with state 'assigned", function(done, server, client) {
      var jobId = server.evalSync(insertJob);
      var shiftId = server.evalSync(insertShift);

      server.evalSync(updateJob, jobId, 'status', 'assigned');
      server.evalSync(updateJob, jobId, 'onshift', shiftId);

      var jobBefore = server.evalSync(getJob, jobId);
      assert.equal(jobBefore.onshift, shiftId);
      assert.equal(jobBefore.status, 'assigned');

      var assign = client.evalSync(assignJobToShiftMethod, jobId, null);
      assert.equal(assign, null);

      var jobAfter = server.evalSync(getJob, jobId);
      assert.equal(jobAfter.onshift, null);
      assert.equal(jobAfter.status, 'draft');

      done();
    });

    test("without state 'assigned", function(done, server, client) {
      var jobId = server.evalSync(insertJob);
      var shiftId = server.evalSync(insertShift);

      server.evalSync(updateJob, jobId, 'status', 'finished');
      server.evalSync(updateJob, jobId, 'onshift', shiftId);

      var jobBefore = server.evalSync(getJob, jobId);
      assert.equal(jobBefore.onshift, shiftId);
      assert.equal(jobBefore.status, 'finished');

      var assign = client.evalSync(assignJobToShiftMethod, jobId, null);
      assert.equal(assign.error, 404);
      done();
    });
  });
});

suite("Update job status - setJobStatus", function() {
  suite("Without assigned to a shift", function() {
    test("status 'draft'", function(done, server, client) {
      var jobId = server.evalSync(insertJob);
      var jobBefore = server.evalSync(getJob, jobId);
      assert.equal(jobBefore.status, 'draft');

      var setStatus = client.evalSync(setJobStatusMethod, jobId);
      assert.equal(setStatus.error, 404);
      done();
    });
  });

  suite("With assigned to a shift", function() {
    test("status 'draft'", function(done, server, client) {
      var jobId = server.evalSync(insertJob);
      var shiftId = server.evalSync(insertShift);
      var jobBefore = server.evalSync(getJob, jobId);
      server.evalSync(updateJob, jobId, 'onshift', shiftId);   
      assert.equal(jobBefore.status, 'draft');

      var setStatus = client.evalSync(setJobStatusMethod, jobId);
      assert.equal(setStatus.error, 404);
      done();
    });

    test("status 'assigned'", function(done, server, client) {
      var jobId = server.evalSync(insertJob);
      var shiftId = server.evalSync(insertShift);
      server.evalSync(updateJob, jobId, 'onshift', shiftId);   
      server.evalSync(updateJob, jobId, 'status', "assigned");   
      var jobBefore = server.evalSync(getJob, jobId);
      assert.equal(jobBefore.status, 'assigned');

      var setStatus = client.evalSync(setJobStatusMethod, jobId);
      assert.equal(setStatus, null);

      var jobAfter = server.evalSync(getJob, jobId);
      assert.equal(jobAfter.status, 'started');
      done();
    });

    test("status 'started'", function(done, server, client) {
      var jobId = server.evalSync(insertJob);
      var shiftId = server.evalSync(insertShift);
      server.evalSync(updateJob, jobId, 'onshift', shiftId);  
      server.evalSync(updateJob, jobId, 'status', "started");    
      var jobBefore = server.evalSync(getJob, jobId);
      assert.equal(jobBefore.status, 'started');

      var setStatus = client.evalSync(setJobStatusMethod, jobId);
      assert.equal(setStatus, null);

      var jobAfter = server.evalSync(getJob, jobId);
      assert.equal(jobAfter.status, 'finished');
      done();
    });

     test("status 'finished'", function(done, server, client) {
      var jobId = server.evalSync(insertJob);
      var shiftId = server.evalSync(insertShift);
      server.evalSync(updateJob, jobId, 'onshift', shiftId);  
      server.evalSync(updateJob, jobId, 'status', "finished");    
      var jobBefore = server.evalSync(getJob, jobId);
      assert.equal(jobBefore.status, 'finished');

      var setStatus = client.evalSync(setJobStatusMethod, jobId);
      assert.equal(setStatus.error, 404);
      done();
    });
  });
});

insertJob = function() {
  var jobInfo = {
    "name": "job 1",
    "activeTime": 12,
    "details": "details",
    "image": "/image.jpg",
    "portions": 10,
    "ingCost": "$12",
    "shelfLife": "2",
    "createdOn": Date.now(),
    "createdBy": null, //add logged in users id
    "refDate": new Date().toISOString().slice(0,10).replace(/-/g,"-"),
    "onshift": null,
    "status": 'draft',
    "assignedTo": null,
    "assignedBy": null
  }
  var id = Jobs.insert(jobInfo);
  emit("return", id);
}

insertShift = function() {
  var info = {
    "startTime": "8.00AM",
    "endTime": "05.00PM",
    "shiftDate": "2014-12-16",
  }
  var id = Shifts.insert(info);
  emit("return", id);
}

updateJob = function(id, option, value) {
  var toUpdate = {};
  toUpdate[option] = value;
  Jobs.update({_id: id}, {$set: toUpdate});
  emit("return");
}

getJob = function(jobId) {
  var a = Jobs.findOne(jobId);
  emit("return", a);
}

assignJobToShiftMethod = function(jobId, shiftId) {
  Meteor.call("assignJobToShift", jobId, shiftId, null, function(err) {
    emit("return", err);
  });
}


setJobStatusMethod = function(jobId) {
  Meteor.call("setJobStatus", jobId, function(err) {
    emit("return", err);
  });
}