document.addEventListener('DOMContentLoaded', function(){
    fetch('http://localhost:5000/clientProducts')
    .then(res => res.json())
    .then(data => loadProducts(data['data']));
});


function loadProducts(data){
    const products = document.querySelector('.pro-container');
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