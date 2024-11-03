$('#signUpBtn').click(function () { 
    let data = {
        username: $('#username').val(),
        password: $('#password').val()
    };
    console.log("Sending data:", data);

    axios.post(`/auth/register`, data)
    .then(res => {
        console.log(res);
        window.location.href = `/admin/${res.data.userId}`;
    })
    .catch(err => {
        console.error(err.response.data.message);
        $('.message').html(`<h1 class="textMessage">${err.response.data.message}</h1>`);
        $('#message').show();

        setTimeout(function() {
            $('#message').hide();
        }, 5000);
    });
});
