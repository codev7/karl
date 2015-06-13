var component = FlowComponents.define("teamHours", function(props) {
  this.onRendered(this.onListRendered);
});

component.state.week = function() {
  var weekNo = Router.current().params.week;
  var week = getDatesFromWeekNumber(weekNo);
  return week;
}

component.state.users = function() {
  return Meteor.users.find();
}

component.prototype.onListRendered = function() {
  $('.dataTables-example').dataTable({
    responsive: true,
    "dom": 'T<"clear">lfrtip',
    "tableTools": {
        "sSwfPath": "js/plugins/dataTables/swf/copy_csv_xls_pdf.swf"
    }
  });
                            
  /* Init DataTables */
  var oTable = $('#editable').dataTable();

  /* Apply the jEditable handlers to the table */
  oTable.$('td').editable( '../example_ajax.php', {
    callback: function( sValue, y ) {
      var aPos = oTable.fnGetPosition( this );
      oTable.fnUpdate( sValue, aPos[0], aPos[1] );
    },
    submitdata: function ( value, settings ) {
      return {
        "row_id": this.parentNode.getAttribute('id'),
        "column": oTable.fnGetPosition( this )[2]
      };
    },

    "width": "90%",
    "height": "100%"
  });
}