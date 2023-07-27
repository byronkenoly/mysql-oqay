document.addEventListener('DOMContentLoaded', function(){
    fetch('http://localhost:5000/newArrivals')
    .then(res => res.json())
    .then(data => loadNewProducts(data['data']));
});


function loadNewProducts(data){
    const products = document.querySelector('.newarrival-container');
    let productsHtml = "";

    data.forEach(function({product, price, filename}){
        let path = `/img/${filename}`;

        productsHtml += `<div class="pro">`;
        productsHtml += `    <img src=${path} alt='${product}' class="imagen">`;
        productsHtml += `    <div class="des">`;
        productsHtml += `        <h5 class="titulo">${product}</h5>`;
        productsHtml += `        <h4 class="precio">Ksh. ${price}</h4>`;
        productsHtml += `    </div>`;
        productsHtml += `    <i class="fa fa-shopping-cart cart"></i>`;
        productsHtml += `</div>`;
    });

    products.innerHTML = productsHtml;

    let allProducts = document.getElementsByClassName('cart');
    
    for (let i = 0; i < allProducts.length; i++){
        let itemSelected = allProducts[i];
        itemSelected.addEventListener('click', addToCartClicked);
    }
}

let cartIcon = document.querySelector('.header-cart');
let cartPopup = document.querySelector('.cart-popup');
let closeCart = document.querySelector('.close-mark');

//open cart
cartIcon.onclick = function (){
    cartPopup.classList.add("active");
}

//close cart
closeCart.onclick = function (){
    cartPopup.classList.remove("active");
}

if (document.readyState == 'loading'){
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

function ready(){
    //remove items from cart
    let removeItemBtns = document.getElementsByClassName('cart-remove');
    //console.log(removeItemBtns);

    for (let i = 0; i < removeItemBtns.length; i++){
        let btn = removeItemBtns[i];
        btn.addEventListener('click', removeFromCart);
    }

    //quantity changes
    let quantityInputs = document.getElementsByClassName('product-quantity');
    //console.log(quantityInputs);
    for (let i = 0; i < quantityInputs.length; i++){
        let qty = quantityInputs[i];
        qty.addEventListener('change', quantityChanged);
    }
}

//remove from cart
function removeFromCart(event){
    let btnClicked = event.target;
    btnClicked.parentElement.remove();
    computeTotal();
}

//quantity changes
function quantityChanged(event){
    let input = event.target;

    if (isNaN(input.value) || input.value <= 0){
        input.value = 1;
    }

    computeTotal();
}

//add to cart
function addToCartClicked(event){
    let button = event.target;
    productInfo = button.parentElement;

    let title = productInfo.getElementsByClassName('titulo')[0].innerText;
    let price = productInfo.getElementsByClassName('precio')[0].innerText;
    let img = productInfo.getElementsByClassName('imagen')[0].src;

    addProductToCart(title, price, img);
    computeTotal();
}

function addProductToCart(title, price, img){
    let cartShopBox = document.createElement('div');
    cartShopBox.classList.add('cart-box');

    let cartItems = document.getElementsByClassName('cart-content')[0];
    let cartItemsNames = cartItems.getElementsByClassName('product-title');

    for (let i = 0; i < cartItemsNames.length; i++){
        if (cartItemsNames[i].innerText == title){
            alert("Already added to cart");
        }
    }

    let cartBoxHtml = `
                        <img src=${img} alt='${title}'>
                        <div class="detail-box">
                            <div class="product-title">${title}</div>
                            <div class="product-price">${price}</div>
                            <input type="number" value="1" class="product-quantity">
                        </div>
                        <i class="fa fa-trash cart-remove" aria-hidden="true"></i>
    `;
    cartShopBox.innerHTML = cartBoxHtml;
    cartItems.append(cartShopBox);
    
    cartShopBox
    .getElementsByClassName('cart-remove')[0]
    .addEventListener('click', removeFromCart);
    
    cartShopBox
    .getElementsByClassName('product-quantity')[0]
    .addEventListener('change', quantityChanged);
}

//Compute total price
function computeTotal(){
    let cartContent = document.getElementsByClassName('cart-content')[0];
    let cartBoxes = cartContent.getElementsByClassName('cart-box');

    let total = 0;

    for (let i = 0; i < cartBoxes.length; i++){
        let cartBox = cartBoxes[i];

        let priceElement = cartBox.getElementsByClassName('product-price')[0];
        let price = parseFloat(priceElement.innerText.replace('Ksh. ', ''));

        let quantityElement = cartBox.getElementsByClassName('product-quantity')[0];
        let quantity = quantityElement.value;

        total = total + (price * quantity);

        document.getElementsByClassName('total-figure')[0].innerText = 'Ksh. ' + total;
    }
}

function placeOrder(){
    let cartContent = document.getElementsByClassName('cart-content')[0];
    let cartBoxes = cartContent.getElementsByClassName('cart-box');

    let myCart = [];
    let total = {};
    total['total'] = document.getElementsByClassName('total-figure')[0].innerText;

    for (let i = 0; i < cartBoxes.length; i++){
        let itemObject = {};
        let cartBox = cartBoxes[i];

        let nameElement = cartBox.getElementsByClassName('product-title')[0];
        let name = nameElement.innerText;

        let quantityElement = cartBox.getElementsByClassName('product-quantity')[0];
        let quantity = quantityElement.value;

        let priceElement = cartBox.getElementsByClassName('product-price')[0];
        let price = parseFloat(priceElement.innerText.replace('Ksh. ', ''));

        itemObject['name'] = name;
        itemObject['quantity'] = quantity;
        itemObject['price'] = price;

        myCart.push(itemObject);
    }

    myCart.push(total);

    Email.send({
        Host : "smtp.elasticemail.com",
        Username : "byronochieng01@gmail.com",
        Password : "4842F76D9512384AB4CC4812038F6DA0EB9A",
        To : 'lempitse32@gmail.com',
        From : "byronochieng01@gmail.com",
        Subject : "ORDER",
        Body : myCart
    }).then(
      message => alert(message)
    );
}

document.addEventListener("DOMContentLoaded", function(){
    let buyBtn = document.querySelector('.place_order_btn');
    buyBtn.onclick = function(e){
        e.preventDefault();
        placeOrder();
    };
})