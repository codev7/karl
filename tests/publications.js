var server = meteor({flavor: "fiber"});
var client = ddp(server, {flavor: "fiber"});

describe("Testing Publications", function() {
  describe("daily Publication", function() {
    it("without worker", function() {
      var date = '2015-12-01';
      var job_1 = server.execute(createNewJob, ['new1', 'prep']);
      var job_2 = server.execute(createNewJob, ['new2', 'prep']);
      var job_3 = server.execute(createNewJob, ['new2', 'prep']);
      var job_4 = server.execute(createNewJob, ['new2', 'prep']);

      var shiftId_1 = server.execute(createNewShift, [date, null, [job_1, job_2]]);
      var shiftId_2 = server.execute(createNewShift, [date, "worker", [job_3, job_4]]);

      server.execute(updateJob, [job_1, shiftId_1]);
      server.execute(updateJob, [job_2, shiftId_1]);
      server.execute(updateJob, [job_3, shiftId_2]);
      server.execute(updateJob, [job_4, shiftId_2]);

      var sub_id = client.subscribe('daily', [date, null]);
      var shifts_data = client.collection('shifts');
      expect(Object.keys(shifts_data).length).to.be.equal(2);

      var job_data = client.collection('jobs');
      expect(Object.keys(job_data).length).to.be.equal(4);
      client.unsubscribe(sub_id);
    });

    it("with worker", function() {
      var date = '2015-12-05';
      var job_1 = server.execute(createNewJob, ['new1', 'prep']);
      var job_2 = server.execute(createNewJob, ['new2', 'prep']);
      var job_3 = server.execute(createNewJob, ['new2', 'prep']);
      var job_4 = server.execute(createNewJob, ['new2', 'prep']);

      var worker = server.execute(createNewWorker, [false]);

      var shiftId_1 = server.execute(createNewShift, [date, null, [job_1, job_2]]);
      var shiftId_2 = server.execute(createNewShift, [date, "worker", [job_3, job_4]]);

      server.execute(updateJob, [job_1, shiftId_1]);
      server.execute(updateJob, [job_2, shiftId_1]);
      server.execute(updateJob, [job_3, shiftId_2]);
      server.execute(updateJob, [job_4, shiftId_2]);
      server.execute(updateShift, [shiftId_1, worker]);

      var sub_id = client.subscribe('daily', [date, worker]);
      var shifts_data = client.collection('shifts');
      expect(Object.keys(shifts_data).length).to.be.equal(1);

      var job_data = client.collection('jobs');
      expect(Object.keys(job_data).length).to.be.equal(2);
      client.unsubscribe(sub_id);
    });
  });

  describe("weekly Publication", function() {
    it("without worker", function() {
      var date = '2015-12-10';
      var job_1 = server.execute(createNewJob, ['new1', 'prep']);
      var job_2 = server.execute(createNewJob, ['new2', 'prep']);
      var job_3 = server.execute(createNewJob, ['new2', 'prep']);
      var job_4 = server.execute(createNewJob, ['new2', 'prep']);
      var worker = server.execute(createNewWorker, [false]);

      var shiftId_1 = server.execute(createNewShift, [date, null, [job_1, job_2]]);
      var shiftId_2 = server.execute(createNewShift, [date, worker, [job_3, job_4]]);

      server.execute(updateJob, [job_1, shiftId_1]);
      server.execute(updateJob, [job_2, shiftId_1]);
      server.execute(updateJob, [job_3, shiftId_2]);
      server.execute(updateJob, [job_4, shiftId_2]);

      var dates = {
        "day1": '2015-12-07',
        "day7": "2015-12-13"
      }
      var sub_id = client.subscribe('weekly', [dates, null]);
      var shifts_data = client.collection('shifts');
      expect(Object.keys(shifts_data).length).to.be.equal(2);

      var job_data = client.collection('jobs');
      expect(Object.keys(job_data).length).to.be.equal(4);

      var worker_data = client.collection('workers');
      expect(Object.keys(worker_data).length).to.be.equal(1);

      client.unsubscribe(sub_id);
    });

    it("with worker", function() {
      var date = '2015-12-10';
      var job_1 = server.execute(createNewJob, ['new1', 'prep']);
      var job_2 = server.execute(createNewJob, ['new2', 'prep']);
      var job_3 = server.execute(createNewJob, ['new2', 'prep']);
      var job_4 = server.execute(createNewJob, ['new2', 'prep']);
      var worker = server.execute(createNewWorker, [false]);

      var shiftId_1 = server.execute(createNewShift, [date, null, [job_1, job_2]]);
      var shiftId_2 = server.execute(createNewShift, [date, worker, [job_3, job_4]]);

      server.execute(updateJob, [job_1, shiftId_1]);
      server.execute(updateJob, [job_2, shiftId_1]);
      server.execute(updateJob, [job_3, shiftId_2]);
      server.execute(updateJob, [job_4, shiftId_2]);

      var dates = {
        "day1": '2015-12-07',
        "day7": "2015-12-13"
      }
      var sub_id = client.subscribe('weekly', [dates, worker]);
      var shifts_data = client.collection('shifts');
      expect(Object.keys(shifts_data).length).to.be.equal(1);

      var job_data = client.collection('jobs');
      expect(Object.keys(job_data).length).to.be.equal(2);

      client.unsubscribe(sub_id);
    });
  });
});

createNewShift = function(date, assignedTo, jobs) {
  var doc = {
    "shiftDate": date,
    "startTime": 8.00,
    "endTime": 17.00,
    "assignedTo": assignedTo,
    "jobs": jobs
  }
  return Shifts.insert(doc);
}

createNewJob = function(name, type) {
  var doc = {
    "name": name,
    "type": type,
    "status": 'draft',
  }
  return Jobs.insert(doc);
}

updateJob = function(id, shiftId) {
  Jobs.update({"_id": id}, {$set: {"onshift": shiftId}});
  return;
}

updateShift = function(id, worker) {
  Shifts.update({'_id': id}, {$set: {'assignedTo': worker}});
  return;
}

createNewWorker = function(resign) {
  var info = {
    "name": "test worker",
    "type": "chef",
    "wage": "100",
    "workLimit": 10,
    "resign": resign
  }
  return Workers.insert(info);
}
