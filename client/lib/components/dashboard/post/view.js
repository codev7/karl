Template.onePost.rendered = function(){
    $(".message-input-comment").val("");
};

Template.onePost.events({
    'click .comment-post': function(event) {
        event.preventDefault();
        var idbuf = $(event.target).closest("div").attr("data-id");
        if($('.comment_field_' + idbuf).css('display') == 'none') {
            $('.comment_field').css("display", "none");
            $('.comment_field_' + idbuf).css("display", "block");
            Session.set({"comment_post_id":idbuf});
        }else {
            $('.comment_field_' + idbuf).css("display", "none");
        }
    },'click .like-post': function(event) {
    },'click .share-post': function(event) {
    },
    'keypress .message-input-comment': function(event) {
        if(event.keyCode == 10 || event.keyCode == 13) {
            event.preventDefault();
            var text = $(".message-input-comment").val();
            FlowComponents.callAction('submitcommenttopost', text);

        }
    }
});

Template.onePost.helpers({
    settings: function() {
        return {
            position: "top",
            limit: 10,
            rules: [
                {
                    token: '@',
                    collection: Meteor.users,
                    field: "username",
                    filter: { "_id": {$nin: [Meteor.userId()]}, "isActive": true},
                    template: Template.user
                }
            ]
        };
    }
});