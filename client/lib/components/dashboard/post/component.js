var component = FlowComponents.define("onePost", function(props) {
    this.post = props.post;
});

component.state.name = function() {
    var user = Meteor.users.findOne({"_id":this.post.createdBy});
    if(user) {
        return user.username;
    } else return;
}

component.state.profilePicture = function() {
    var user = Meteor.users.findOne(this.post.createdBy);
    if(user) {
        var image = "/images/user-image.jpeg";
        if(user.services && user.services.google) {
            image = user.services.google.picture;
        }
        return image;
    }else return;
}
component.state.createdOn = function() {
    return this.post.createdOn;
}
component.state.id = function() {
    return this.post._id;
}
component.state.text = function() {
    var text = this.post.text;
    return text;
}