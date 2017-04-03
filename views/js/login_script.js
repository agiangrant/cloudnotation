// login_script.js

$(document).ready(function() {
    var inputNames = ['firstName', 'lastName', 'usernameS', 'passwordS'];
    $.each(inputNames, function(idx, val) {
        $('#'+val).on('focusout', function() {
            var showError = function() {
                $('#'+val+'Div').addClass('has-error');
                $('#'+val+'Glyph').show();
                $('#'+val+'Help').show();
            };
            if($(this).val() === undefined || $(this).val() === "") {
                showError();
            }
            else if(val === 'usernameS' && $(this).val().search(/..*@..*\...*/) === -1) {
                showError();
            }
            else if(val === 'passwordS' && ($(this).val().search(/[0-9]/) === -1 || $(this).val().search(/[A-Z]/) === -1 ||
                $(this).val().search(/[a-z]/) === -1 || $(this).val().length < 6)) {
                showError();
            }
            else{
                $('#'+val+'Div').removeClass('has-error');
                $('#'+val+'Glyph').hide();
                $('#'+val+'Help').hide();
            }
        });
    });
});