Meteor.methods({
  'sendNotifications': function(itemId, type, options) {
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
    var info = {};
    info.type = type;
    info.ref = itemId;
    info.read = false;
    info.title = options.title;
    info.createdBy = userId;
    info.text = options.text;
    info.actionType = options.type;
    var allSubscribers = [];

    var itemSubsbcribers = Subscriptions.findOne(itemId);
    if(itemSubsbcribers && itemSubsbcribers.subscribers.length > 0) {
      allSubscribers = itemSubsbcribers.subscribers;
    }

    if(type == "menu") {
      var listSubscribers = Subscriptions.findOne("menulist");
      if(listSubscribers && listSubscribers.subscribers.length > 0) {
        if(allSubscribers > 0) {
          allSubscribers.concat(listSubscribers.subscribers);
        } else {
          allSubscribers = listSubscribers.subscribers;
        }
      }
      if(options.type == "delete") {
        if(!options.time) {
          logger.error('Items deleted time needed');
          throw new Meteor.Error(404, "Items deleted time needed");
        }
        time = options.time;
        info.createdOn = time;
      } else {
        item = MenuItems.findOne(itemId);
        if(options.type == "create") {
          info.createdOn = item.createdOn;
          info.text = item.name;
        } else if(options.type == "edit") {
          info.createdOn = item.editedOn;
        }
      }

    } else if(type == "job") {
      var listSubscribers = Subscriptions.findOne("joblist");
      if(listSubscribers && listSubscribers.subscribers.length > 0) {
        if(allSubscribers > 0) {
          allSubscribers.concat(listSubscribers.subscribers);
        } else {
          allSubscribers = listSubscribers.subscribers;
        }
      }
      if(options.type == "delete") {
        if(!options.time) {
          logger.error('Items deleted time needed');
          throw new Meteor.Error(404, "Items deleted time needed");
        }
        time = options.time;
        info.createdOn = time;
      } else {
        item = JobItems.findOne(itemId);
        if(options.type == "create") {
          info.createdOn = item.createdOn;
          info.text = item.name;
        } else if(options.type == "edit") {
          info.createdOn = item.editedOn;
        }
      }

    } else if(type == "comment") {
      
    }

    allSubscribers.forEach(function(subscriber) {
      if(subscriber != userId) {
        var doc = info;
        doc.to = subscriber;

        var id = Notifications.insert(doc);
        logger.info("Notification send to userId", subscriber, id);
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
      var filter = new RegExp(username, 'i');
      var subscriber = Meteor.users.findOne({"username": filter});
      if(subscriber && (subscriber._id != user._id)) {
        var doc = {
          "to": subscriber._id,
          "read": false,
          "createdBy": user._id,
          "notifyRef": commentId,
          "createdOn": comment.createdOn,
          "type": "comment",
          "msg": "New comment on " + item.name + ".",
          "desc": comment.text
        }
        var id = Notifications.insert(doc);
        logger.info("Notification send to tagged user", subscriber._id, id);
        return;
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