$(document).ready(function(){

// ---------- column layout -----------------------------------------

  if ($('.eaRightColumnContent').length && $('.eaLeftColumnContent').length) {
    $('body').addClass('twocolumn');
    sortTwoColumn();
    // append submit button to column with form fields
    if ($('.eaRightColumnContent .eaFormField').length ||
        $('.eaRightColumnContent .eaMessageContent').length ) {
      $('.eaSubmitResetButtonGroup').appendTo($('.en_right_wrapper').last());
     } else {
      $('.eaSubmitResetButtonGroup').appendTo($('.en_left_wrapper').last());
    }
  } else {
    $('body').addClass('onecolumn');
  }

  // resize page to fit around a column with absolute position
  function fixColumns($col){
    if ($col.css('position') == 'absolute'){
      var h = 60 + 52 * $col.length; // paddings
      $col.children().each(function(){
        h += $(this).outerHeight();
      });
      if ($('#page').height() < h) {
        $('#page').css('min-height', h);
      }
    } else {
      $('#page').css('min-height', '');
    }
  }

  if ($('.twocolumn #page.classic').length) {
    var $col = $('.en_right_wrapper');
    // fix on load
    $(window).load(fixColumns($col));
    // fix on (finishing) resize
    var resizeTimer;
    $(window).resize(function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fixColumns($col), 250);
    });
  }

// ---------- move footer to bottom ---------------------------------

  $('#footer').appendTo('#page');


// ---------- "show more" toggle ------------------------------------

  $('#background-info').css('display', 'none');
  $('.info-toggle').on('click', function(e) {
    var $toggle = $(this);
    var $target = $('#background-info');
    if ($target.length > 0) {
      $target.slideDown();
      $('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
    }
    e.preventDefault();
  });
// ---------- fancy forms -------------------------------------------

  // enable Picker and Selector
  // see http://www.benplum.com/formstone/
  if (typeof $.fn.selecter == 'function') {
    $('select').selecter();
  }
  if (typeof $.fn.picker == 'function') {
    $('input[type=radio], input[type=checkbox]').picker();
  }

  // add a class for picker label height
  $('.picker-label').each(function(){
    var label = $(this);
    var handle = label.siblings('.picker-handle');
    if (label.height() > 26){
      label.parent().addClass('multiline');
    } else {
      label.parent().addClass('oneline');
    }
  });

// ---------- validations -------------------------------------------

  // move validation icon next to label
  // and the error message below the label
  $('.eaErrorMessage').each(function() {
    var self = $(this);
    var label = self.siblings('.eaFormElementLabel');
    var field = self.siblings('.eaFormField');
    var icon = $('.eaValidationIcon', label.parent());
    icon.appendTo(label);
    self.appendTo(field);
  });

  // add class to field, where error occured
  $(window).on('DOMSubtreeModified', '.eaErrorMessage', function(e) {
    var self = $(e.target);
    if (!self.is(':empty')) {
      self.parent().not('form').addClass('validationError');
    } else {
      self.parent().not('form').removeClass('validationError');
    }
  });

  // add class #eaerrors if empty
  $(window).on('load DOMSubtreeModified', '#eaerrors', function(e) {
    var self = $(e.target);
    if (self.text().trim() == "") {
      self.addClass('empty');
    } else {
      self.removeClass('empty');
    }
  });

// ---------- progress bar ------------------------------------------

  // configure progressbar = thermometer = counter
  var $thermometerEl = $('.pgbar-thermometer');
  var thermometerTarget = 250; // default
  var thermometerStart = 0; // default

  // read target value from data-target
  var thermometerDataTarget = $thermometerEl.data('target');
  if (typeof thermometerDataTarget !== 'undefined') {
    var parsedTarget = parseInt(thermometerDataTarget, 10);
    if (!isNaN(parsedTarget) && parsedTarget > 0) {
      thermometerTarget = parsedTarget;
    }
  }
  // read start value from data-start
  var thermometerDataStart = $thermometerEl.data('start');
  if (typeof thermometerDataStart !== 'undefined') {
    var parsedStart = parseInt(thermometerDataStart, 10);
    if (!isNaN(parsedStart) && parsedStart > 0) {
      thermometerStart = parsedStart;
    }
  }
  // initialize eActivistThermometer
  $thermometerEl.eActivistThermometer({
    token: 'd0120c28-2bdb-46a6-9086-b8d22e0f5669',
    campaignId: $('input[name="ea.campaign.id"]').val(),
    target: thermometerTarget,
    initialValue: thermometerStart,
    service: 'EaEmailAOTarget',
    targetDataColumn: 'participatingSupporters'
  });

});
