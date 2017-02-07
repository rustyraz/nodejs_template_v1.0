'use strict';
Stripe.setPublishableKey('pk_test_pAdGwFlVlm18H0759YalVvfs');

$(function(){

  var $form = $('#payment-form');
  $form.submit(function(event){
    $('#payment-errors').hide();
    $form.find('.submit').prop('disabled', true);
    Stripe.card.createToken($form, stripeResponseHandler);
    //prevent the form from being submitted
    return false;
  });
});

function stripeResponseHandler(status, response){
  var $form = $('#payment-form');
  if(response.error){
    //problem found with the credit card
    $form.find('.submit').prop('disabled', false);
    console.log(response.error);
    $('#payment-errors').text(response.error.message);
    $('#payment-errors').show();
  }else{
    //get the response token ID
    var token = response.id;

    //insert the token to the form
    $form.append($('<input type="hidden" name="stripeToken">').val(token));
    //submit the form
    $form.get(0).submit();
  }
}
