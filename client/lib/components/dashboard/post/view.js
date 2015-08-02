Template.newsFeed.events({
    'click .comment-post': function(event,template) {
        event.preventDefault();
        console.log(this);
        $(event.target).find('.comment_field').css("display","block");
    },'click .like-post': function(event) {
    },'click .share-post': function(event) {
    }
});
