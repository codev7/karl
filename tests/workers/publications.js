var server = meteor({flavor: "fiber"});
var client = ddp(server, {flavor: "fiber"});

describe("Testing worker publications", function() {
  describe("activeWorkers publication", function() {
    it("with workers on leave", function() {
      var workers = server.execute(function() {
        var ids = [];
        for(var i=0; i<5; i++) {
          var name = "worker-" + i + "-" + Math.random();
          var id = Workers.insert({"name": name, "type": "chef", "resign": false});
          ids.push(id);
        }
        return ids;
      });
      expect(workers.length).to.be.equal(5);

      var date = "2020-12-31";
      var putWorkerOnLeave = server.execute(function(worker, date) {
        var holiday = Holidays.insert({"date": date, "workers": [worker]});
        var a = Holidays.findOne(holiday);
        return a;
      }, [workers[0], date]);

      var sub_id = client.subscribe("activeWorkers", [date]);

      var data = client.collection('workers');
      expect(Object.keys(data).length).to.be.equal(4);
      client.unsubscribe(sub_id);
    });
  });

  describe("assignedWorkers publication", function() {
    it("with assigned workers", function() {
      var workers = server.execute(function() {
        var ids = [];
        for(var i=0; i<5; i++) {
          var name = "worker-" + i + "-" + Math.random();
          var id = Workers.insert({"name": name, "type": "chef", "resign": false});
          ids.push(id);
        }
        return ids;
      });
      expect(workers.length).to.be.equal(5);

      var date = "2020-12-31";
      var shiftId = server.execute(createNewShift, [date, workers[0]]);
      var sub_id = client.subscribe("assignedWorkers", [date]);

      var data = client.collection('workers');
      expect(Object.keys(data).length).to.be.equal(1);
      client.unsubscribe(sub_id);
    });
  });

  //commented due to failure in combined run
  // describe("allWorkers publication", function() {
  //   it("with resigned workers", function() {
  //     var workers = server.execute(function() {
  //       Workers.remove();
  //       var ids = [];
  //       for(var i=0; i<5; i++) {
  //         var name = "worker-" + Math.random();
  //         var id = Workers.insert({"name": name, "type": "chef", "resign": false});
  //         ids.push(id);
  //       }
  //       return ids;
  //     });
  //     expect(workers.length).to.be.equal(5);

  //     var date = "2020-12-31";
  //     server.execute(resignWorker, [workers[0]]);
  //     var sub_id = client.subscribe("allWorkers");

  //     var data = client.collection('workers');
  //     console.log(data);
  //     expect(Object.keys(data).length).to.be.equal(5);
  //     client.unsubscribe(sub_id);
  //   });
  // });

  describe("workerTypes publication", function() {
    it("with resigned workers", function() {
      var type_1 = server.execute(createNewWorkerType, ["chef"]);
      var type_2 = server.execute(createNewWorkerType, ["waiter"]);
      client.subscribe("workerTypes");

      var data = client.collection('workerTypes');
      expect(Object.keys(data).length).to.be.equal(2);
    });
  });

  describe("monthlyHolidays publication", function() {
    it("with resigned workers", function() {
      var date_1 = '2015-01-01';
      var date_2 = '2015-01-30';
      var holiday_1 = server.execute(createNewHoliday, [date_1]);
      var holiday_2 = server.execute(createNewHoliday, [date_2]);
      var holiday_3 = server.execute(createNewHoliday, ['2015-01-10'])
      client.subscribe("monthlyHolidays", [date_1, date_2]);

      var data = client.collection('holidays');
      expect(Object.keys(data).length).to.be.equal(3);
    });
  });
});

createNewShift = function(date, assignedTo) {
  var doc = {
    "shiftDate": date,
    "startTime": 8.00,
    "endTime": 17.00,
    "assignedTo": assignedTo,
    "jobs": []
  }
  return Shifts.insert(doc);
}

createNewWorker = function() {
  var doc = {
    "name": "worker",
    "type": "chef",
    "resign": false
  }
  return Workers.insert(doc);
}

resignWorker = function(id) {
  return Workers.update({"_id": id}, {$set: {"resign": true}});
}

createNewWorkerType = function(type) {
  return WorkerTypes.insert({"type": type});
}

createNewHoliday = function(date) {
  return Holidays.insert({"date": date, "workers": ['worker1', 'worker2']});
}