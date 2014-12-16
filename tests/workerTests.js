// var assert = require("assert");

// suite("Testing worker", function() {
//   test("Create worker - createWorker method", function(done, server, client) {
//     var info = {
//       "name": "worker 1",
//       "type": "Chef"
//     }
//     var workerId = client.evalSync(function(info) {
//       Meteor.call("createWorker", info, function(err, id) {
//         emit('return', {"err": err, "id": id});
//       });
//     }, info);

//     var worker = client.evalSync(function(workerId) {
//       var a = Workers.findOne(workerId);
//       emit("return", a);
//     }, workerId.id);
//     assert.equal(worker.err, null);
//     assert.ok(workerId.id);
//     done();
//   });
// });