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

getJob = function(jobId) {
  var a = Jobs.findOne(jobId);
  emit("return", a);
}