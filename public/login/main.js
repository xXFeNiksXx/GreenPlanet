$(document).ready(function () {
    axios.get(`/auth/check-token`)
    .then(res => {
        console.log("Користувач авторизований:", res.data);
        window.location.href = `/admin/${res.data.userId}`;
    })
    .catch(err => {
        console.log("Користувач не авторизований або токен недійсний");
    });
});
$('#loginBtn').click(function (event) { 
    event.preventDefault();
    let password = $('#password').val();
    if(password.length > 8){
    let data = {
        username: $('#username').val(),
        password: $('#password').val()
    };
    console.log("Sending data:", data);

    axios.post(`/login`, data)
    .then(res => {
        console.log("відповідь сервера:", res.data);
        window.location.href = `/admin/${res.data.userId}`;
    })
    .catch(err => {
        console.error(err.response?.data?.message); 
        $('.message').html(`<h1 class="textMessage">${err.response?.data?.message}</h1>`);
        $('#message').show();

        setTimeout(() => $('#message').hide(), 5000);
    });
}else{
    $('.message').html(`<h1 class="textMessage">пароль має бути не менше 8 символів</h1>`);
    $('#message').show();

    setTimeout(function() {
        $('#message').hide();
    }, 5000);
}
});
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
  
$('#signUpBtn').click(function (event) { 
    event.preventDefault();
    let passwordSign = $('#passwordSign').val();
    if(passwordSign.length > 8){
    let data = {
        username: $('#usernameSign').val(),
        password: $('#passwordSign').val()
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
}else{
    $('.message').html(`<h1 class="textMessage">пароль має бути не менше 8 символів</h1>`);
    $('#message').show();

    setTimeout(function() {
        $('#message').hide();
    }, 5000);
}
});
