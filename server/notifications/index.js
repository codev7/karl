Meteor.methods({
  'sendNotifications': function(type, itemId) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var user = Meteor.user();
    if(!itemId) {
      logger.error('ItemId should have a value');
      throw new Meteor.Error(404, "ItemId should have a value");
    }
    var item = null;
    if(type == "menulist" || type == "menuCreate") {
      item = MenuItems.findOne(itemId);
    } else if(type == "joblist" || type == "jobCreate") {
      item = JobItems.findOne(itemId);
    } else if(type == "deleteMenu" || type == "deleteJob") {
      item = itemId;
    }
    var allSubscribers = [];
    var itemSubsbcribers = Subscriptions.findOne(itemId);
    if(itemSubsbcribers && itemSubsbcribers.subscribers.length > 0) {
      allSubscribers = itemSubsbcribers.subscribers;
    }
    var findType = type;
    if(type == "menuCreate") {
      findType = "menulist";
    } else if(type == "jobCreate") {
      findType = "joblist";
    } else if(type == "deleteMenu") {
      findType = "menulist";
    } else if(type == "deleteJob") {
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
    allSubscribers.forEach(function(subscriber) {
      if(subscriber != user._id) {
        var doc = {
          "to": subscriber,
          "read": false,
          "createdBy": user._id,
          "notifyRef": item._id
        }
        if(type == "menulist") {
          doc.createdOn = item.editedOn;
          doc.type = "menu";
          doc.msg = " updated menu <a href='/menuItem/" + item._id + "'>" + item.name;
        } else if(type == "joblist") {
          doc.type = "job";
          doc.createdOn = item.editedOn;
          doc.msg = " updated job <a href='/jobItem/" + item._id + "'>" + item.name;
        } else if(type == "menuCreate") {
          doc.type = "menu";
          doc.createdOn = item.createdOn;
          doc.msg = " created a new menu <a href='/menuItem/" + item._id + "'>" + item.name;
        } else if(type == "jobCreate") {
          doc.type = "job";
          doc.createdOn = item.createdOn;
          doc.msg = " created a new job <a href='/jobItem/" + item._id + "'>" + item.name;
        } else if(type == "deleteMenu") {
          doc.type = "menu";
          doc.createdOn = Date.now();
          doc.msg = " deleted menu " + item.name;
        } else if(type == "deleteJob") {
          doc.type = "job";
          doc.createdOn = Date.now();
          doc.msg = " deleted job " + item.name;
        }
        Notifications.insert(doc);
        logger.info("Notification send to userId", subscriber);
      }
    });
  },

  notifyTagged: function(users, itemId, commentId) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var user = Meteor.user();
    if(users.length < 0) {
      logger.error('User ids not found');
      throw new Meteor.Error(404, "User ids not found");
    }
    var item = null;
    var type = "menuItem";
    item = MenuItems.findOne(itemId);
    if(!item) {
      type = "jobItem";
      item = JobItems.findOne(itemId);
    }
    var comment = Comments.findOne(commentId);
    if(!comment) {
      logger.error('Comment not found');
      throw new Meteor.Error(404, "Comment not found");
    }
    users.forEach(function(username) {
      var filter = new RegExp(username, 'i')
      var subscriber = Meteor.users.findOne({"username": filter});
      if(subscriber) {
        var doc = {
          "to": subscriber._id,
          "read": false,
          "createdBy": user._id,
          "notifyRef": commentId,
          "createdOn": comment.createdOn,
          "type": "comment",
          "msg": "mentioned you on a comment on <a href='/" + type + "/" + item._id + "'>" + item.name + "</a>"
        }
        Notifications.insert(doc);
        logger.info("Notification send to tagged user", subscriber._id);
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