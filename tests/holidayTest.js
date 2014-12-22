var assert = require("assert");

suite("Setting worker holidays - setWorkerHoliday method", function() {
  suite("Adding worker holiday", function() {
    suite("New holiday entry", function() {
      test("Worker has not been assigned to a shift", function(done, server, client) {
        var workerId = server.evalSync(insertWorker);
        var date = "2017-12-30";
        var holidayBefore = server.evalSync(getHoliday, date);
        assert.equal(holidayBefore, undefined);

        var setHoliday = client.evalSync(function(workerId, date, onHoliday) {
          Meteor.call("setWorkerHoliday", workerId, date, onHoliday, function(err) {
            emit("return", err);
          });
        }, workerId, date, true);
        assert.equal(setHoliday, null);

        var holidayAfter = server.evalSync(getHoliday, date);
        assert.equal(holidayAfter.workers.length, 1);
        done();
      });

      test("Worker has been assigned to a shift", function(done, server, client) {
        var workerId = server.evalSync(insertWorker);
        var shiftId = server.evalSync(insertShift);

        var assignToShift = server.evalSync(updateShift, shiftId, "assignedTo", workerId);
        var shiftBefore = server.evalSync(getShift, shiftId);
        assert.equal(shiftBefore.assignedTo, workerId);

        var date = "2017-12-30";
        var holidayBefore = server.evalSync(getHoliday, date);
        assert.equal(holidayBefore, undefined);

        var setHoliday = client.evalSync(function(workerId, date, onHoliday) {
          Meteor.call("setWorkerHoliday", workerId, date, onHoliday, function(err) {
            emit("return", err);
          });
        }, workerId, date, true);
        assert.equal(setHoliday, null);

        var holidayAfter = server.evalSync(getHoliday, date);
        assert.equal(holidayAfter.workers.length, 1);
        var shiftAfter = server.evalSync(getShift, shiftId);
        assert.equal(shiftAfter.assignedTo, null);
        done();
      });
    });

    suite("Existing holiday entry", function() {
      suite("Adding holiday entry for worker", function() {
        test("Worker has been assigned to a shift", function(done, server, client) {
          var workerId = server.evalSync(insertWorker);
          var shiftId = server.evalSync(insertShift);
          var holidayId = server.evalSync(insertHoliday);

          var assignToShift = server.evalSync(updateShift, shiftId, "assignedTo", workerId);
          var shiftBefore = server.evalSync(getShift, shiftId);
          assert.equal(shiftBefore.assignedTo, workerId);

          var date = "2017-12-30";
          var holidayBefore = server.evalSync(getHoliday, date);
          assert.equal(holidayBefore.workers.length, 1);

          var setHoliday = client.evalSync(function(workerId, date, onHoliday) {
            Meteor.call("setWorkerHoliday", workerId, date, onHoliday, function(err) {
              emit("return", err);
            });
          }, workerId, date, true);
          assert.equal(setHoliday, null);

          var holidayAfter = server.evalSync(getHoliday, date);
          assert.equal(holidayAfter.workers.length, 2);
          // console.log(holidayAfter);
          var shiftAfter = server.evalSync(getShift, shiftId);
          // console.log("-------nadeeeeeeeee------", shiftAfter);
          assert.equal(shiftAfter.assignedTo, null);
          done();
        });

        test("Worker has not been assigned to a shift", function(done, server, client) {
          var workerId = server.evalSync(insertWorker);
          var holidayId = server.evalSync(insertHoliday);

          var date = "2017-12-30";
          var holidayBefore = server.evalSync(getHoliday, date);
          assert.equal(holidayBefore.workers.length, 1);

          var setHoliday = client.evalSync(function(workerId, date, onHoliday) {
            Meteor.call("setWorkerHoliday", workerId, date, onHoliday, function(err) {
              emit("return", err);
            });
          }, workerId, date, true);
          assert.equal(setHoliday, null);

          var holidayAfter = server.evalSync(getHoliday, date);
          assert.equal(holidayAfter.workers.length, 2);
          done();
        });

        test("Worker already exist for that holiday", function(done, server, client) {
          var workerId = server.evalSync(insertWorker);
          var holidayId = server.evalSync(insertHoliday);
          server.evalSync(updateHolidayWorker, holidayId, workerId);

          var date = "2017-12-30";
          var holidayBefore = server.evalSync(getHoliday, date);
          assert.equal(holidayBefore.workers.length, 2);

          var setHoliday = client.evalSync(function(workerId, date, onHoliday) {
            Meteor.call("setWorkerHoliday", workerId, date, onHoliday, function(err) {
              emit("return", err);
            });
          }, workerId, date, true);
          assert.equal(setHoliday, null);

          var holidayAfter = server.evalSync(getHoliday, date);
          assert.equal(holidayAfter.workers.length, 2);
          done();
        });
      });
  
      test("Remove worker holiday", function(done, server, client) {
        var workerId = server.evalSync(insertWorker);
        var holidayId = server.evalSync(insertHoliday);
        server.evalSync(updateHolidayWorker, holidayId, workerId);

        var date = "2017-12-30";
        var holidayBefore = server.evalSync(getHoliday, date);
        assert.equal(holidayBefore.workers.length, 2);

        var setHoliday = client.evalSync(function(workerId, date, onHoliday) {
          Meteor.call("setWorkerHoliday", workerId, date, onHoliday, function(err) {
            emit("return", err);
          });
        }, workerId, date, false);
        assert.equal(setHoliday, null);

        var holidayAfter = server.evalSync(getHoliday, date);
        assert.equal(holidayAfter.workers.length, 1);
        done();
      });
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
    "shiftDate": "2017-12-30",
  }
  var id = Shifts.insert(info);
  emit("return", id);
}

insertHoliday = function() {
  var info = {
    date: "2017-12-30",
    workers: ["worker1"]
  }
  var id = Holidays.insert(info);
  emit("return", id);
}


updateShift = function(id, option, value) {
  var toUpdate = {};
  toUpdate[option] = value;
  Shifts.update({_id: id}, {$set: toUpdate});
  emit("return");
}

updateHolidayWorker = function(id, workerId) {
  Holidays.update({'_id': id}, {$addToSet: {'workers': workerId}});
  emit("return");
}

getHoliday = function(date) {
  var holiday = Holidays.findOne({"date": date});
  emit("return", holiday);
}

getShift = function(id) {
  var shift = Shifts.findOne(id);
  emit("return", shift);
}