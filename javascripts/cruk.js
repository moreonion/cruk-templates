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

  var $toggle =  $('.info-toggle');
  var $target =  $($toggle.attr('href'));

  if ($toggle.is(':visible') && $target.length) {
    $target.css('display', 'none');
    $toggle.on('click', function(e) {
      $target.slideDown();
      $('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
      e.preventDefault();
    });
  }

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

  // remove #eaerrors if empty
  $(window).on('DOMSubtreeModified', '#eaerrors', function(e) {
    var self = $(e.target);
    if (self.text().trim() == "") {
      self.hide();
    } else {
      self.show();
    }
  });

// ---------- undo EN contact list formatting -----------------------

  $('.eaContactNameContainer').each(function(){
    var $checkbox = $(this).children('.eaContactSelectCheckbox');
    if ($checkbox.length) {
      // keep checkbox + label, remove node text + &nbsp;
      $(this).addClass('has-checkbox').wrapInner('<div class="remove"></div>');
      $('.remove', this).replaceWith($checkbox);
    }
  });

// ---------- progress bar ------------------------------------------

  // configure progressbar = thermometer = counter
  var $thermometerEl = $('.pgbar-thermometer, .big-counter');
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

// ---------- counter animation -------------------------------------

// test if we have -webkit-background-clip support
if (typeof document.body.style.webkitBackgroundClip !== 'undefined') {
  $('html').addClass('webkit-background-clip');
}

// odometer options, have to be set before loading odometer.js
window.odometerOptions = {
  selector: '.t_current',
  format: '(ddd)',
  count: 0
}
