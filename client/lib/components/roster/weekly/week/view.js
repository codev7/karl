Template.weeklyShiftRoster.rendered = function() {
   $(".select-worker").editable({
      source: [ // TODO: Import this list dynamically from server
          {id: '0', text: 'Select worker'},
          {id: 'emp1', text: 'Employee 1'},
          {id: 'emp2', text: 'Employee 2'},
          {id: 'emp3', text: 'Employee 3'}
      ]
  });

  /**
   * Time Selection Editable
   * */
  // $('.duty_time').editable({
  //     type: 'combodate',
  //     title: 'Select time',
  //     template: "HH:mm",
  //     viewformat: "hh:mm",
  //     format: "YYYY-MM-DD HH:mm",
  //     url: '/post',
  //     display: false,
  //     showbuttons: true
  // });
  /**
   * Text Editable
   * */
  $('.company_name').editable({
      title: 'Company Name'
  });
}