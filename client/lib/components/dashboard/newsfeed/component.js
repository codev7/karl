var autolinker = new Autolinker({
    "twitter": false
});
var component = FlowComponents.define("newsFeed", function(props) {
    this.referenceId = props.user._id;
});

component.state.postsExist = function() {
    var count = Posts.find({},{sort: {"createdOn": -1}}).count();
    if(count > 0) {
        return true;
    } else {
        return false;
    }
};

component.state.postsList = function() {
    var posts = Posts.find({},{sort: {"createdOn": -1}});
    return posts;
};

component.action.submit = function(text) {
    var ref = this.referenceId;
    //find tagged users
    var matched = /(?:^|\W)@(\w+)(?!\w)/g, match, matches = [];
    while (match = matched.exec(text)) {
        matches.push(match[1]);
    }
    var taggedUsers = [];
    matches.forEach(function(username) {
        var filter = new RegExp(username, 'i');
        var subscriber = Meteor.users.findOne({"username": filter});
        if(subscriber) {
            var userClass = "label-info";
            var doc = {
                "user": "@" + subscriber.username,
                "class": userClass
            }
            taggedUsers.push(doc);
        }
    });

    var classes = ['info', 'success', 'danger', 'primary', 'warning'];
    var textHtml = "<div class='non'>" + text + "</div>"
    taggedUsers.forEach(function(user) {
        textHtml = textHtml.replace(user.user, "<span class='label " + user.class + "'>" + user.user + "</span>");
    });
    var linkedText = autolinker.link(textHtml);

    Meteor.call("createPost", linkedText, ref, function(err, id) {
        if(err) {
            console.log(err);
            return alert(err.reason);
        } else {
            var options = {
                "title": "New Posts on by " + Meteor.user().username,
                "users": matches,
                "postId": id,
                "type": "post"
            }
            Meteor.call("sendNotifications", ref, "post", options, function(err) {
                if(err) {
                    console.log(err);
                    return alert(err.reason);
                }
            });
        }
        $('.message-input-post').val("");
    });
};