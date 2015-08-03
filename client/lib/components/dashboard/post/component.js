var autolinker = new Autolinker({
    "twitter": false
});
var component = FlowComponents.define("onePost", function(props) {
    this.post = props.post;
});
component.state.checkifnotcomment = function(){

    var ref=this.post.reference;
    var createdby=this.post.createdBy;
    if( ref == createdby )
        return true;
    else
        return false;
};

component.state.name = function() {
    var user = Meteor.users.findOne({"_id":this.post.createdBy});
    if(user) {
        return user.username;
    } else return;
};

component.state.profilePicture = function() {
    var user = Meteor.users.findOne(this.post.createdBy);
    if(user) {
        var image = "/images/user-image.jpeg";
        if(user.services && user.services.google) {
            image = user.services.google.picture;
        }
        return image;
    }else return;
};
component.state.createdOn = function() {
    return this.post.createdOn;
};
component.state.id = function() {
    return this.post._id;
};
component.state.text = function() {
    var text = this.post.text;
    return text;
};
component.state.like = function() {
    var like = this.post.like;
    return like;
};

component.action.submitcommenttopost = function(text) {
    var ref = Session.get("comment_post_id");
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
        $('.message-input-comment').val("");
    });
};
component.action.submitlikepost = function(countlike) {
    var ref = Session.get("post_like_id");
    Meteor.call("updatePost", countlike, ref, function(err, id) {
        if(err) {
            console.log(err);
            return alert(err.reason);
        } else {
            var options = {
                "title": "update Posts on by " + Meteor.user().username,
                "postId": id,
                "type": "post update"
            }
            Meteor.call("sendNotifications", ref, "post", options, function(err) {
                if(err) {
                    console.log(err);
                    return alert(err.reason);
                }
            });
        }
    });
};


component.state.commentsof=function(){
    return Posts.find({"reference":this.post._id},{"createdBy":{$not:this.post._id}},{sort:{"createdOn":-1}});
}

component.state.activecomment=function(){
    var count = Posts.find({"reference":this.post._id},{"createdBy":{$not:this.post._id}},{sort:{"createdOn":-1}}).count();
    if(count) {
        return true;
    }else return false;
}
