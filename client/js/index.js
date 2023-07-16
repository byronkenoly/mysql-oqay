document.addEventListener('DOMContentLoaded', function(){
    fetch('http://localhost:5000/getAll')
    .then(res => res.json())
    .then(data => loadHTMLTable(data['data']));
});

document.querySelector('table tbody').addEventListener('click', function(event){
    if (event.target.className === "delete-row-btn"){
        deleteRowById(event.target.dataset.id);
    }

    if (event.target.className === "edit-row-btn"){
        editRowById(event.target.dataset.id);
    }

    if (event.target.className === "add-img-btn"){
        addImgById(event.target.dataset.id);
    }
});

function deleteRowById(id){
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success){
            location.reload();
        }
    })
}

function editRowById(id){
    const updateSection = document.querySelector('#update-row');
    document.querySelector('#add-img-row').hidden = true;
    updateSection.hidden = false;
    document.querySelector('#update-product-btn').dataset.id = id;
}

function addImgById(id){
    const addImgSection = document.querySelector('#add-img-row');
    document.querySelector('#update-row').hidden = true;
    addImgSection.hidden = false;
    document.querySelector('#upload-image-btn').dataset.id = id;
}

const addBtn = document.querySelector('#add-product-btn');
const updateBtn = document.querySelector('#update-product-btn');
const searchBtn = document.querySelector('#search-btn');
const addImgBtn = document.querySelector('#upload-image-btn');

addImgBtn.onclick = function(event){
    event.preventDefault();
    const id = document.querySelector('#upload-image-btn').dataset.id;
    const file = document.querySelector('#image-input');

    const formData = new FormData();

    formData.append('id', id);
    formData.append('file', file.files[0]);

    //console.log(...formData);
    fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => console.log(data))
}

searchBtn.onclick = function(){
    const searchValue = document.querySelector('#search-input').value;

    fetch('http://localhost:5000/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

addBtn.onclick = function(){
    const productInput = document.querySelector('#product-input');
    const product = productInput.value;
    productInput.value = "";

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ product : product })
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}

updateBtn.onclick = function(){
    const product = document.querySelector('#product-update');
    const price = document.querySelector('#price-update');
    const quantity = document.querySelector('#quantity-update');
    const mass = document.querySelector('#mass-update');

    if (product.value === ""){
        product.value = "lmao"
    }

    if (price.value === ""){
        price.value = 0
    }

    if (quantity.value === ""){
        quantity.value = 0
    }

    if (mass.value === ""){
        mass.value = 0
    }

    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: document.querySelector('#update-product-btn').dataset.id,
            product: product.value,
            price: price.value,
            quantity: quantity.value,
            mass: mass.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success){
            location.reload();
        }
    })
}

function insertRowIntoTable(data){
    console.log(data);
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (let key in data){
        if (data.hasOwnProperty(key)){
            if (key === 'dateAdded'){
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</button></td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</button></td>`;

    tableHtml += "</tr>";

    if (isTableData){
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

function loadHTMLTable(data){
    const table = document.querySelector('table tbody');
    let tableHtml = "";

    if (data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='8'>No data</td></tr>";
    }

    data.forEach(function({id, product, price, quantity, mass, date_added}){
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${product}</td>`;
        tableHtml += `<td>${price}</td>`;
        tableHtml += `<td>${quantity}</td>`;
        tableHtml += `<td>${mass}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`;
        tableHtml += `<td><button class="add-img-btn" data-id=${id}>Add Image</button></td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}