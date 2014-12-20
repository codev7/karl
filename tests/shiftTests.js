var assert = require("assert");

suite("Testing shifts", function() {
  test("Create shift - createShift method", function(done, server, client) {
    var info = {
      "startTime": "8.00AM",
      "endTime": "05.00PM",
      "shiftDate": "2014-12-16",
    }

    var shiftId = client.evalSync(function(info) {
      Meteor.call("createShift", info, function(err, id) {
        emit('return', {"err": err, "id": id});
      });
    }, info);

    var shift = client.evalSync(function(shiftId) {
      var a = Shifts.findOne(shiftId);
      emit("return", a);
    }, shiftId.id);

    assert.equal(shiftId.err, null);
    assert.ok(shiftId.id);
    done();
  });
});