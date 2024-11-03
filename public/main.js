// axios.get('http://localhost:3000/goods')
//     .then(res => {
//         console.log(res.data);
//         for (let el of res.data) {
//             $('.goodsContainer').append(`<div>${el.title}:${el.price}</div>`);
//         }
//     })



// корзина та товари



let cartList = [];
function getProduct(){
    axios.get('/goods')
        .then(res=>{
            let count = 0;
            for(let el of res.data){
                if (count >= 3) {
                    break;
                }
                count++
                let imeg = el.file;
                let normImeg = imeg.substring(12);
                console.log(normImeg);
                $('.goodsContainer').append(`<div class='goodsCard'><img class="goodsImg" src="/uploads/${normImeg}" alt=""> <div class='goodsDesc'><h3>${el.title}</h3><p>${el.price}$<button class="addItem" id="${el._id}">+</button></p></div></div>`)
                $('.addItem').click((e) => {

                        if (el._id == e.target.id) {
                            cartList.push(el);
                            console.log(cartList);
                            showCartInner(cartList);
                        }
                })
            }
        })
}
getProduct()

let cheker = true;
let pop = document.getElementById('pop');
$(`#cart`).click(function () { 
    if (cheker == true) {
        pop.style.display = 'flex';
        cheker = false;
    }else{
        pop.style.display = 'none';
        cheker = true;
    }
});



function showCartInner(cartList) {
    $('.cartPopupContainer').empty();
    for (let el of cartList) {
        console.log(el);
        $('.cartPopupContainer').append(`<div class='newOrder'><h5>${el.title}</h5> <h5>${el.price}</h5></div>`);
    }
    if (cartList.length == 0) {
        $('.cartPopupContainer').append(`<h1 class='nonOrder'>cart is empty!</h1>`);
    }
}

// закінчення коду корзини та товарів


// відправка данних
let data;
$('#confirmBtn').click(function (e) { 
    if(cartList.length > 0){
        data = {
            list: cartList,
            name: $('#username').val(),
            phone: $('#phone').val(),
            time: Date.now()
        }
        axios.post(`/save-order`, data)
        .then( res => {
            console.log(res.status);
            if (res.status === 201) {
                $('#username').val('');
                $('#phone').val('');
                cartList = [];
                showCartInner([]);
            }
        })
    }
    console.log(data);
});



function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailPattern.test(email);
  }
$('#subscribe').click(async function () {
    let data = {
        email: $('#email').val()
    };
    if(validateEmail(data.email)){
        axios.post('/send-mail', data)
        .then(res => {
            console.log(res);
        })
    }
});
$('#pushMes').click(async function () { 
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
        document.cookie = "pushmessage=true;";
    }
});



axios.get(`/ouradress`)
.then(res=>{
    for(let el of res.data){
        console.log(el);
        $('#basementAdress').append(`<h3 class='adressText'>${el.adress}</h3>`)

    }
})






$(document).ready(function (){
    $(".contact").click(function (){
        $('html, body').animate({
            scrollTop: $("#basementAdress").offset().top
        }, 2000);
    });
  });



  
let spinnerContainer = document.querySelector('.spinnerContainer');

window.addEventListener('load', () => {
    spinnerContainer.classList.add('hide');
})