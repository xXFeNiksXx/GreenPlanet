let cartList = [];
    axios.get('/goods')
        .then(res=>{
            for(let el of res.data){
                let imeg = el.file;
                let normImeg = imeg.substring(12);
                console.log(normImeg);
                $('.goodsContainer').append(`<div class='cardgoods'><img class="goodsImg" src="/uploads/${normImeg}" alt=""> <div class='goodsDesc'><h3 class="nameGoods">${el.title}</h3><p class="priceGoods">${el.price}$</p><button class="addItem" id="${el._id}">+</button></div></div>`)
                $('.addItem').click((e) => {

                    if (el._id == e.target.id) {
                        cartList.push(el);
                        console.log(cartList);
                        showCartInner(cartList);
                    }
            })
            }
        })

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
            if (res.status === 200) {
                $('#username').val('');
                $('#phone').val('');
                showCartInner([]);


                
                    let formData = data;
        
                    axios.post('/sentname', formData)
                    .then((res)=>{
                        console.log(res);
                    })
            }
        })
    }
    console.log(data);
});
let spinnerContainer = document.querySelector('.spinnerContainer');

window.addEventListener('load', () => {
    spinnerContainer.classList.add('hide');
})