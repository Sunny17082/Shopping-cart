let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [
    {
        "id": 1,
        "name":" Apple",
        "price": 50,
        "image": "image/apple.png"
    },
    {
        "id": 2,
        "name":" Orange",
        "price": 60,
        "image": "image/orange.png"
    },
    {
        "id": 3,
        "name":" Banana",
        "price": 50,
        "image": "image/banana.png"
    },
    {
        "id": 4,
        "name":" Watermelon",
        "price": 100,
        "image": "image/watermelon.png"
    },
    {
        "id": 5,
        "name":" Mango",
        "price": 60,
        "image": "image/mango.png"
    },
    {
        "id": 6,
        "name":" Guava",
        "price": 30,
        "image": "image/guava.png"
    },
    {
        "id": 7,
        "name":" Pineapple",
        "price": 70,
        "image": "image/pineapple.png"
    },
    {
        "id": 8,
        "name":" Grapes",
        "price": 60,
        "image": "image/grapes.png"
    }
];
let cart = [];
let filterArray = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

    const addDataToHTML = (currArray) => {
        listProductHTML.innerHTML="";
        if(currArray.length > 0)
        {
            currArray.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = 
                `
                <div class="image">
                <img src="${product.image}" alt="">
                </div>
                <h2>${product.name}</h2>
                <div class="price-card">₹${product.price}</div>
                <button class="addCart">Add To Cart</button>
                <button class="know">></button>`;
                listProductHTML.appendChild(newProduct);
            });
        }
    }
    const information = document.getElementById("info");
    const productImage = document.getElementById("productimage");
    const productName = document.getElementById("productname");
    const productPrice = document.getElementById("productprice");
    const list = document.getElementById("list");
    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('addCart')){
            let id_product = positionClick.parentElement.dataset.id;
            addToCart(id_product);
        } else if(positionClick.classList.contains('know')) {
            let id_product = positionClick.parentElement.dataset.id;
            productImage.src = products[id_product-1].image;
            productName.innerHTML = products[id_product-1].name;
            productPrice.innerHTML = products[id_product-1].price;
            information.classList.remove("no");
            list.classList.add("no");
        }
    })
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    }else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

let cartvalue = document.getElementById("cartvalue");
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalPrice = 0;
    let totalQuantity = 0;
    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity = totalQuantity +  item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
                <div class="cart-item">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">₹${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${item.quantity}</span>
                    <span class="plus">+</span>
                </div>
            `;
            totalPrice = totalPrice + info.price * item.quantity;
        })
    }
    iconCartSpan.innerText = totalQuantity;
    cartvalue.innerText = totalPrice.toLocaleString();
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
})
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
        
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                }else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

const initApp = () => {
    addDataToHTML(products);
    // get data cart from memory
    if(localStorage.getItem('cart')){
        cart = JSON.parse(localStorage.getItem('cart'));
        addCartToHTML();
    }
}
initApp();

document.getElementById("search").addEventListener("keyup", function() {
    let text = document.getElementById("search").value;

    filterArray = products.filter(function(a) {
        if(a.name.toLowerCase().includes(text.toLowerCase())) {
            return a.name;
        }
    });
    if(this.value == "") {
        addDataToHTML(products);
    } else {
        addDataToHTML(filterArray);
        main()
    }
});

function main() {
    information.classList.add("no");
    list.classList.remove("no");
};

var loader = document.getElementById("preloader");
window.addEventListener("load", function() {
    loader.style.display = "none";
});