Template.comment.rendered = function() {
  var list = $(".chat-discussion");
  list.scrollTop(list.prop("scrollHeight") - list.height());
}