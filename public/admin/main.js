function getUserIdFromUrl() {
    const path = window.location.pathname;
    let userId = path.substring(7);
    return userId;
}

const userId = getUserIdFromUrl();
    console.log('User ID:', userId);
$('.addGoods').click(()=>{
    let data = {
        title: $('#title').val(),
        price: $('#price').val(),
        file: $('#file').val()
    }
    const formData = new FormData();
    formData.append('file', $('#file')[0].files[0]);
    axios.post('/api/upload', formData)
    axios.post('/add-goods', data)
        .then(res=>{
            console.log(res)
        })
        location.reload();
})
$('#confirmBtnnnn').click((e)=>{
    let data = {
        username: $('#usernameN').val(),
        password: $('#passwordN').val(),
        id: userId
    }
    axios.post('/updateuser', data)
        .then(res=>{
            console.log(res);
        }).catch(err => {
            console.error('Error updating user:', err);
        });
})
$('.sendButAdress').click(()=>{
    let data = {
        adress: $('#adress').val()
    }

    axios.post('/adress', data)
            location.reload();
})


function viewProduct(){
    axios.get('/goods')
        .then(res=>{
            for(let el of res.data){
                let imeg = el.file;
                let normImeg = imeg.substring(12);
                console.log(normImeg);
                $('.goodsContainer').append(`<div class='cardgoods'><img class="goodsImg" src="/uploads/${normImeg}" alt=""> <div class='goodsDesc'><h3 class="nameGoods">${el.title}</h3><p class="priceGoods">${el.price}$</p><button class="delBut" id="${el._id}">delete</button></div></div>`)
            }
            $('.cardgoods').click(function (e) {

                axios.delete(`/goods/${e.target.id}`)
                    .then(res => {
                        location.reload();
                    })
            })
        })
}
viewProduct()

axios.get('/getorders')
    .then(res => {
        console.log(res.data);
        let doneid;
        let dataOrder;

        for (let el of res.data) {
            let goods = '';
            let cardId = el._id;
            console.log(cardId);
            for (let item of el.list) {
                goods += item.title + ' ';
            }
            console.log(el);
            let date = new Date(el.time);
            $('.orderContainer').append(`<div class='orderItem'>
            <h3>${el.name}</h3>
            <div>${el.phone}</div>
            <div class="productContainer">${goods}</div>
            <div class="orderButs">
            <button class="deleteOrderBtn" id="${el._id}">delete</button>
            </div>
            <div>
                 <div>${date.getDate()}/${date.getMonth()}/${date.getFullYear()}</div>
                  <div>${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</div>
            </div>
            
        </div>`)
        doneid = el._id + 'donebtn';
        console.log(doneid);
        }
        $(`.deleteOrderBtn`).click(function (e) { 
            axios.delete(`/orders/${e.target.id}`)
            .then(res => {
                location.reload();
            })
        });
        // $(`.doneOrderBtn`).click(function (e) { 
        //     let idlong = e.target.id;
        //     let idlongindtring = JSON.stringify(idlong);
        //     if (idlongindtring.substring(25, 32) == 'donebtn') {
        //         axios.post(`http://localhost:3000/doneorders`)
        //     }
        // });
    })







let cheker = true;
let pop = document.getElementById('pop');
let wrbox = document.getElementById('wrap');
$(`.addGoodsBtn`).click(function () { 
    if (cheker == true) {
        pop.style.display = 'flex';
        cheker = false;
        wrbox.style.filter = 'blur(1px)';
    }else{
        pop.style.display = 'none';
        cheker = true;
        wrbox.style.filter = 'blur(0px)';
    }
});







let cheker3 = true;
let pop3 = document.getElementById('pop3');
$(`.changeAdressBtn`).click(function () { 
    if (cheker3 == true) {
        pop3.style.display = 'flex';
        cheker3 = false;
        wrbox.style.filter = 'blur(1px)';
    }else{
        pop3.style.display = 'none';
        cheker3 = true;
        wrbox.style.filter = 'blur(0px)';
    }
});



let cheker123 = true;
let pop123 = document.getElementById('pop123');
$(`.newPasswordBtn`).click(function () { 
    if (cheker123 == true) {
        pop123.style.display = 'flex';
        cheker123 = false;
        wrbox.style.filter = 'blur(1px)';
    }else{
        pop123.style.display = 'none';
        cheker123 = true;
        wrbox.style.filter = 'blur(0px)';
    }
});








let cheker5 = true;
let pop5 = document.getElementById('pop5');
$(`.sendMessageBtn`).click(function () { 
    if (cheker5 == true) {
        pop5.style.display = 'flex';
        cheker5 = false;
        wrbox.style.filter = 'blur(1px)';
    }else{
        pop5.style.display = 'none';
        cheker5 = true;
        wrbox.style.filter = 'blur(0px)';
    }
});
$('#mark').click(function () { 
    pop.style.display = 'none';
    cheker = true;
    wrbox.style.filter = 'blur(0px)';
});
$('#mark123').click(function () { 
    pop123.style.display = 'none';
    cheker = true;
    wrbox.style.filter = 'blur(0px)';
});



$('#mark3').click(function () { 
    pop3.style.display = 'none';
    cheker3 = true;
    wrbox.style.filter = 'blur(0px)';
});



$('#mark5').click(function () { 
    pop5.style.display = 'none';
    cheker5 = true;
    wrbox.style.filter = 'blur(0px)';
});
$('#sendMessage').click(async function () { 
    let data = {
        message: $('#message').val()
    }
    $('.messageLoad').empty();
    $('.messageLoad').append(`<div class="spinner"></div><h1>wait</h1>`);
  await axios.post(`/send-message`, data)
    .then(res => {
        console.log(res);
        $('.messageLoad').empty();
        new Notification('Daunku', {
            body: $('#message').val()
        });
    })
});






axios.get(`/ouradress`)
.then(res=>{
    for(let el of res.data){
        console.log(el);
        $('.adressContainerView').append(`<div class="adressBox"><h3 class='adressText'>${el.adress}</h3><button class="deleteAdressBtn" id="${el._id}">delete</button></div>`)

    }
    $(`.deleteAdressBtn`).click(function (e) { 
        axios.delete(`/adress/${e.target.id}`)
        .then(res => {
            location.reload();
        })
    });
})


let spinnerContainer = document.querySelector('.spinnerContainer');

window.addEventListener('load', () => {
    spinnerContainer.classList.add('hide');
})