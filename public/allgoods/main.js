function toBase64(buffer) {
    const binary = [];
    const bytes = new Uint8Array(buffer);
    bytes.forEach(byte => binary.push(String.fromCharCode(byte)));
    return btoa(binary.join(''));
}
let cartList = [];
function viewProduct() {
    axios.get('/goods')
        .then(res => {
            console.log('Response from /goods:', res.data);

            $('.goodsContainer').empty();

            if (res.data && Array.isArray(res.data)) {
                res.data.forEach(el => {
                    console.log('Processing product:', el);

                    let base64Data = '';
                    if (el.data && el.data.data) {
                        try {
                            base64Data = toBase64(el.data.data);
                        } catch (err) {
                            console.error('Error converting to Base64:', err);
                        }
                    } else {
                        console.warn('No image data for product:', el.title);
                    }

                    $('.goodsContainer').append(`
                        <div class='cardgoods'>
                            <img class="goodsImg" src="${base64Data ? `data:${el.contentType};base64,${base64Data}` : 'placeholder.jpg'}" alt="Product Image">
                            <div class='goodsDesc'>
                                <h3 class="nameGoods">${el.title}</h3>
                                <p class="priceGoods">${el.price}$</p>
                                <button class="addItem" id="${el._id}">+</button>
                            </div>
                        </div>
                    `);
                });
            } else {
                console.error('No products found or invalid data format');
            }
            for(let el of res.data){
            $('.addItem').click((e) => {

                if (el._id == e.target.id) {
                    cartList.push(el);
                    console.log(cartList);
                    showCartInner(cartList);
                }
        })
    }
        })
        .catch(err => {
            console.error('Error fetching products:', err);
        });
        
}
viewProduct();

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
const dropdownButton = document.getElementById('dropdownButton');
const dropdownContent = document.getElementById('dropdownContent');
dropdownButton.addEventListener('click', () => {
    const isDisplayed = dropdownContent.style.display === 'block';
    dropdownContent.style.display = isDisplayed ? 'none' : 'block';
});
document.addEventListener('click', (event) => {
    if (!event.target.closest('.dropdown')) {
        dropdownContent.style.display = 'none';
    }
});
let isDarkTheme = localStorage.getItem('theme') === 'dark';

function updateTheme() {
    if (isDarkTheme) {
        $('.wrap').css('background', '#333');
        $('html').css('color', '#fff');
    } else {
        $('.wrap').css('background', '#fff');
        $('html').css('color', '#333');
    }
}
updateTheme();

$('#bgColor').click(function () {
    isDarkTheme = !isDarkTheme;
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    updateTheme();
});
let isBWMode = localStorage.getItem('themeb') === 'grey';

function updateBWMode() {
        $('.cartPopup').toggleClass('grayscale-mode', isBWMode);
        $('.spinnerContainer').toggleClass('grayscale-mode', isBWMode);
        $('.wrap').toggleClass('grayscale-mode', isBWMode);
}
updateBWMode();

$('#bgColor1').click(function () {
    isBWMode = !isBWMode;
    localStorage.setItem('themeb', isBWMode ? 'grey' : 'normal');
    updateBWMode();
});
let menucheker = true;

$('#burger').click(function (e) {
    e.stopPropagation();
    if (menucheker) {
        $('.menublock').css('left', '0');
        $('.wrapContainer').css('background', 'rgba(0, 0, 0, 0.4)');
        $('.wrapContainer').css('filter', 'brightness(0.6)');
        menucheker = false;
    } else {
        $('.menublock').css('left', '-300px');
        $('.wrapContainer').css('background', 'rgba(0, 0, 0, 0.0)');
        $('.wrapContainer').css('filter', 'brightness(1)');
        menucheker = true;
    }
});
$(document).click(function () {
    if (!menucheker) {
        $('.menublock').css('left', '-300px');
        $('.wrapContainer').css('background', 'rgba(0, 0, 0, 0.0)');
        $('.wrapContainer').css('filter', 'brightness(1)');
        menucheker = true;
    }
});
$('.menublock').click(function (e) {
    e.stopPropagation();
});