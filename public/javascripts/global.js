var userListData = [];
var pageNo;
var thisUserObject;

// DOM Ready =============================================================
$(document).ready(function() {

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Populate the user table on initial page load
    pageNo=0;
    populateTable();

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    $('#prev').on('click', function(){
        pageNo = pageNo-1;
        populateTable();
    });

    $('#next').on('click', function(){
        pageNo = pageNo+1;
        populateTable();
    });

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
    $('#btnDeleteUser').on('click', discardUser);

    $('#btnUpdateUser').on('click', updateUser);
  
    $('input.update_field').change(function(){
        if ($(this).is(':checked'))
            $(this).next('div.update_value').show();
        else
            $(this).next('div.update_value').hide();
        }).change();



    $('#addUser fieldset input#inputUserEmail').keyup(function() {
        $('span.error-keyup-e').remove();
        var inputVal = $(this).val();
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if(!emailReg.test(inputVal)) {
            $(this).after('<span class="error error-keyup-e", style="font-size: 8pt"><br>Invalid Email Format.</span>');
        }
    });

    $('#addUser fieldset input#inputUserAge').keyup(function() {
        $('span.error-keyup-a').hide();
        var inputVal = $(this).val();
        var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
        if(!numericReg.test(inputVal)) {
            $(this).after('<span class="error error-keyup-a", style="font-size: 8pt"><br>Numeric characters only.</span>');
        }
    });


});

// Functions =============================================================

// Fill table with data
function populateTable() {

    if (pageNo==0) $('#prev').attr('disabled','disabled');
    else $('#prev').removeAttr('disabled');

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist/'+pageNo, function( data ) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;
        if(data==null){ pageNo = 0;
            populateTable();
        }

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this.username + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);

        var userData = $('#btnDeleteUser').attr('rel');
         
        if(userData){
            thisUserObject = $.parseJSON(userData);
            $('#userName').text(thisUserObject.username);
            $('#userInfoName').text(thisUserObject.fullname);
            $('#userInfoEmail').text(thisUserObject.email);
            $('#userInfoAge').text(thisUserObject.age);
            $('#userInfoGender').text(thisUserObject.gender);
            $('#userInfoLocation').text(thisUserObject.location);
        }
    });
    
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

};


// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val(),
            'password': $('#addUser fieldset input#inputUserPassword').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {
            console.log(response.msg);

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            }else if(response.msg === 'duplictae'){
                    // Clear the form inputs
                $('#addUser fieldset input').val('');
                $('#note').text('Username already exists');
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};


// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();
            $('#userInfoName').text('');
            $('#userInfoAge').text('');
            $('#userInfoGender').text('');
            $('#userInfoLocation').text('');


        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

// Delete User
function discardUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete your account?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + thisUserObject.username
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            window.location='/logout';

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

// Add User
function updateUser(event) {
    event.preventDefault();

        // If it is, compile all user info into one object
            var NewEmail = $('div.update_value input#email').val();
            var NewLocation = $('div.update_value input#location').val();
            var NewPassword = $('div.update_value input#password').val();

            
            if(NewEmail && NewLocation && NewPassword){
                var newUser = {
                    'email': NewEmail,
                    'location': NewLocation,
                    'password': NewPassword
                }
            }else if(NewEmail && NewLocation){
                var newUser = {
                    'email': NewEmail,
                    'location': NewLocation
                }
            }else if(NewLocation && NewPassword){
                var newUser = {
                    'location': NewLocation,
                    'password': NewPassword
                }
            }else if(NewEmail && NewPassword){
                var newUser = {
                    'email': NewEmail,
                    'password': NewPassword
                }
            }else if(NewEmail){
                var newUser = {
                    'email': NewEmail
                }
            }else if(NewLocation){
                var newUser = {
                    'location': NewLocation
                }

            }else{
                var newUser = {
                    'password': NewPassword
                }
            }


        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'PUT',
            data: newUser,
            url: '/users/updateuser/' + thisUserObject.username,
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === ''){

                  // Clear the form inputs
                $('#userUpdate input').val('');
                if(NewEmail) $('#userInfoEmail').text(newUser.email);
                if(NewLocation) $('#userInfoLocation').text(newUser.location);

            }
            else {
                
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });

    
};
