$('#loginBtn').click(function (event) { 
    event.preventDefault();
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
});
