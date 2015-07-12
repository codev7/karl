Meteor.startup(function() {
  Comments._ensureIndex({"reference": 1, "createdOn": -1});

  Categories._ensureIndex({"name": 1});

  Statuses._ensureIndex({"name": 1});

  Ingredients._ensureIndex({"code": 1, "status": 1});
  Ingredients._ensureIndex({"code": 1, "suppliers": 1, "description": 1})

  JobItems._ensureIndex({"type": 1});
  JobItems._ensureIndex({"ingredients": 1});
  JobItems._ensureIndex({"name": 1});

  Jobs._ensureIndex({"status": 1, "assignedTo":1});

  MenuItems._ensureIndex({"ingredients": 1});
  MenuItems._ensureIndex({"jobItems": 1});
  MenuItems._ensureIndex({"name": 1});
  MenuItems._ensureIndex({"status": 1, "category": 1});

  Notifications._ensureIndex({"to": 1, "read": 1, "createdOn": -1});

  Shifts._ensureIndex({"shiftDate": 1, "assignedTo": 1});

  Subscriptions._ensureIndex({"subscribers": 1});

  Meteor.users._ensureIndex({"isAdmin": 1, "isManager": 1, "isWorker": 1});
});
