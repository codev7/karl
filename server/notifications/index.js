Meteor.methods({
  'sendNotifications': function(itemId, type, options) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();

    var item = null;
    var info = {};
    info.type = type;
    info.read = false;
    info.title = options.title;
    info.createdBy = userId;
    var allSubscribers = [];

    if(type != "comment") {
      if(!itemId) {
        logger.error('ItemId should have a value');
        throw new Meteor.Error(404, "ItemId should have a value");
      }
      info.ref = itemId;
      info.text = options.text;
      info.actionType = options.type;
      var itemSubsbcribers = Subscriptions.findOne(itemId);
      if(itemSubsbcribers && itemSubsbcribers.subscribers.length > 0) {
        allSubscribers = itemSubsbcribers.subscribers;
      }
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
      if(!options.commentId) {
        logger.error('Comment Id needed');
        throw new Meteor.Error(404, "Comment Id needed");
      }
      info.refType = options.type;
      var comment = Comments.findOne(options.commentId);
      if(comment) {
        info.text = comment.text;
        info.createdOn = comment.createdOn;
        info.ref = comment.reference;
      }
    }
    if(type == "job" || type == "menu") {
      allSubscribers.forEach(function(subscriber) {
        if(subscriber != userId) {
          var doc = info;
          doc.to = subscriber;

          var id = Notifications.insert(doc);
          logger.info("Notification send to userId", subscriber, id);
        }
      });
    } else if(type == "comment") {
      if(!options.users) {
        logger.error('User ids not found');
        throw new Meteor.Error(404, "User ids not found");
      }
      options.users.forEach(function(username) {
        var filter = new RegExp(username, 'i');
        var subscriber = Meteor.users.findOne({"username": filter});
        if(subscriber && (subscriber._id != userId)) {
          var doc = info;
          doc.to = subscriber._id;

          var id = Notifications.insert(doc);
          logger.info("Notification send to userId", subscriber._id, id);
        }
      });
    }  
  },

  notifyRoster: function(to, title, text, startDate) {
    var user = Meteor.user();
    if(!user) {
      logger.error("User not found");
      throw new Meteor.Error(404, "User not found");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to delete shifts");
      throw new Meteor.Error(403, "User not permitted to delete shifts ");
    }

    var emailText = "Hi " + to.name + ", <br>";
    emailText += "I've just published the roster for the week starting " + startDate + ".<br><br>";
    emailText += "Here's your shifts";
    emailText += text;
    emailText += "<br>If there are any problems with the shifts, please let me know.";
    emailText += "<br>Thanks.<br>";
    emailText += user.username;
    //email
    Email.send({
      "to": to.email,
      "from": user.emails[0].address,
      "subject": "[Hero Chef] " + title,
      "html": emailText
    });
    logger.info("Email sent for weekly roster", to._id);
    //notification
    var notifi = {
      "type": "roster",
      "title": title,
      "read": false,
      "text": [text],
      "to": to._id,
      "createdOn": new Date().getTime(),
      "createdBy": user._id
    }
    Notifications.insert(notifi);
    logger.info("Notification sent for weekly roster", to._id);
    return;
  },

  'readNotifications': function(id) {
    var userId = Meteor.userId();
    if(!userId) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
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