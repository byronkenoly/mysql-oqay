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
        productsHtml += `    <img src=${path} alt=${product}>`;
        productsHtml += `    <div class="des">`;
        productsHtml += `        <h5>${product}</h5>`;
        productsHtml += `        <h4>${price}</h4>`;
        productsHtml += `    </div>`;
        productsHtml += `    <a href="#"><i class="fa fa-shopping-cart"></i></a>`;
        productsHtml += `</div>`;
    });

    products.innerHTML = productsHtml;
}