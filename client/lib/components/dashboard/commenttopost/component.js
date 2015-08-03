var component = FlowComponents.define("onecommentofPost", function(props) {
    this.commentp = props.commentp;
});
component.state.commentprofileimg = function(){
    var user = Meteor.users.findOne(this.commentp.createdBy);
    if(user) {
        var image = "/images/user-image.jpeg";
        if(user.services && user.services.google) {
            image = user.services.google.picture;
        }
        return image;
    }else return;
}

component.state.commentname = function(){
    var user = Meteor.users.findOne(this.commentp.createdBy);
    return user.username;
}
component.state.commenttext = function(){
    return this.commentp.text;
}

component.state.createdOn = function(){
    return this.commentp.createdOn;
}

component.state.cid = function(){
    return this.commentp._id;
}
component.state.like = function(){
    return this.commentp.like;
}
