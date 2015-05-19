Meteor.methods({
  'sendNotifications': function(type, itemId) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    if(!itemId) {
      logger.error('ItemId should have a value');
      throw new Meteor.Error(404, "ItemId should have a value");
    }
    var item = null;
    if(type == "menulist" || type == "menuCreate") {
      item = MenuItems.findOne(itemId);
    } else if(type == "joblist" || type == "jobCreate") {
      item = JobItems.findOne(itemId);
    }
    var allSubscribers = [];
    var itemSubsbcribers = Subscriptions.findOne(itemId);
    if(itemSubsbcribers && itemSubsbcribers.subscribers.length > 0) {
      allSubscribers = itemSubsbcribers.subscribers;
    }
    if(type == "menulist" || type == "joblist" || type == "menuCreate" || type == "jobCreate") {
      var findType = type;
      if(type == "menuCreate") {
        findType = "menulist";
      } else if(type == "jobCreate") {
        findType = "joblist";
      }
      var listSubscribers = Subscriptions.findOne(findType);
      if(listSubscribers && listSubscribers.subscribers.length > 0) {
        if(allSubscribers > 0) {
          allSubscribers.concat(listSubscribers.subscribers);
        } else {
          allSubscribers = listSubscribers.subscribers;
        }
      }
    }
    allSubscribers.forEach(function(subscriber) {
      if(subscriber != userId) {
        var doc = {
          "to": subscriber,
          "read": false,
          "editedBy": userId
        }
        if(type == "menulist") {
          doc.updated = item._id; 
          doc.editedOn = item.editedOn;
          doc.msg = "<a href='/menuItem/" + item._id + "'>" + item.name + "</a> menu has been updated";
        } else if(type == "joblist") {
          doc.updated = item._id; 
          doc.editedOn = item.editedOn;
          doc.msg = "<a href='/jobItem/" + item._id + "'>" + item.name + "</a> job has been updated";
        } else if(type == "menuCreate") {
          doc.created = item._id; 
          doc.createdOn = item.createdOn;
          doc.msg = "New menu has been created. <a href='/menuItem/" + item._id + "'>" + item.name + "</a>";
        } else if(type == "jobCreate") {
          doc.created = item._id; 
          doc.createdOn = item.createdOn;
          doc.msg = "New job has been created. <a href='/jobItem/" + item._id + "'>" + item.name + "</a>";
        }
        Notifications.insert(doc);
        logger.info("Notification send to userId", subscriber);
      }
    });
  },

  'readNotifications': function(id) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    if(!id) {
      logger.error('Notification id not found');
      throw new Meteor.Error(404, "Notification id not found");
    }
    var notification = Notifications.findOne({'_id': id, 'to': userId});
    if(!notification) {
      logger.error('Notification not found');
      throw new Meteor.Error(404, "Notification not found");
    }
    Notifications.update({'_id': id, 'to': userId}, {$set: {"read": true}});
    logger.info("Notification read", {"user": userId, "notification": id});
  }
});