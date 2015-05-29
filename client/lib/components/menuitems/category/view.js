Template.addNewCategory.events({
  'submit form': function(event) {
    event.preventDefault();
    var name = $(event.target).find('[name=name]').val();
    if(!name) {
      alert("Category name should have a value");
    }
    Meteor.call('createCategory', name, function(err, id) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        $(event.target).find('input').val("");
        $("#addCategoryModal").modal('hide');
      }
    });
  }
});