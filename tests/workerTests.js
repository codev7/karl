var assert = require("assert");

suite("Testing worker", function() {
  test("Create worker - createWorker method", function(done, server, client) {
    var info = {
      "name": "worker 1",
      "type": "Chef"
    }
    var workerId = client.evalSync(function(info) {
      Meteor.call("createWorker", info, function(err, id) {
        emit('return', {"err": err, "id": id});
      });
    }, info);

    var worker = client.evalSync(function(workerId) {
      var a = Workers.findOne(workerId);
      emit("return", a);
    }, workerId.id);
    assert.equal(worker.err, null);
    assert.ok(workerId.id);
    done();
  });
});

suite("Assigning workers to shifts - assignWorkerToShift method", function() {
  suite("With shift id", function() {
    test("Newly assigning worker to shift", function(done, server, client) {
      var workerId = server.evalSync(insertWorker);
      var shiftId = server.evalSync(insertShift);
      var shiftBefore = server.evalSync(getShift, shiftId);
      assert.equal(shiftBefore.assignedTo, null);

      var assigning = client.evalSync(function(workerId, shiftId) {
        Meteor.call("assignWorkerToShift", workerId, shiftId, function(err) {
          emit("return", err);
        });
      }, workerId, shiftId);
      assert.equal(assigning, null);
      
      var shiftAfter = server.evalSync(getShift, shiftId);
      assert.equal(shiftAfter.assignedTo, workerId);
      done();
    });

    test("Shift already has a value for assignedTo", function(done, server, client) {
      var workerId = server.evalSync(insertWorker);
      var shiftId = server.evalSync(insertShift);
      server.evalSync(updateShift, shiftId, "assignedTo", workerId);
      var shiftBefore = server.evalSync(getShift, shiftId);
      assert.equal(shiftBefore.assignedTo, workerId);

      var assigning = client.evalSync(function(workerId, shiftId) {
        Meteor.call("assignWorkerToShift", workerId, shiftId, function(err) {
          emit("return", err);
        });
      }, workerId, shiftId);
      assert.equal(assigning.error, 404);
      done();
    });
  });

  suite("Without shift Id", function() {
    test("removing worker from shift", function(done, server, client) {
      var workerId = server.evalSync(insertWorker);
      var shiftId = server.evalSync(insertShift);

      server.evalSync(updateShift, shiftId, "assignedTo", workerId);
      var shiftBefore = server.evalSync(getShift, shiftId);
      assert.equal(shiftBefore.assignedTo, workerId);
      var date = shiftBefore.shiftDate;

      var assigning = client.evalSync(function(workerId, date) {
        Meteor.call("assignWorkerToShift", workerId, null, {"date": date}, function(err) {
          emit("return", err);
        });
      }, workerId, date);
      assert.equal(assigning, null);

      var shiftAfter = server.evalSync(getShift, shiftId);
      assert.equal(shiftAfter.assignedTo, null);
      done();
    });
  });
});

insertWorker = function() {
  var info = {
    "name": "worker",
    "type": "Chef"
  }
  var id = Workers.insert(info);
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

getShift = function(id) {
  var shift = Shifts.findOne(id);
  emit("return", shift);
}

updateShift = function(id, option, value) {
  var toUpdate = {};
  toUpdate[option] = value;
  Shifts.update({_id: id}, {$set: toUpdate});
  emit("return");
}