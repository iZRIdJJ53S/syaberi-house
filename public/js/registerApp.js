(function() {

  $(function() {

    $('#submit-event').click(function(event) {
      event.preventDefault();
      $('#full-form-tag').submit();
    });

  });

}).call(this);
