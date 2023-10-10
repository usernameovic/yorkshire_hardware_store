window.addEventListener('scroll', headerToggler);
window.addEventListener('scroll', backToTopButtonToggler);




/* ---------------- STICKY HEADER  -------------- */
function headerToggler() {
    if (window.scrollY > document.querySelector('header').getBoundingClientRect().top) {
        document.querySelector('header').classList.add('toggle-main-header')
    } else {
        document.querySelector('header').classList.remove('toggle-main-header');
    }

}
/////////////////////////////////////////////////////////////////////////////////////////





/* -------------- NAZAD NA VRH STRANICE --------------- */
document.querySelector('.scroll-to-top-button').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
})

// Back to top button vidljivost
function backToTopButtonToggler() {

    if (window.scrollY > window.innerHeight / 2) {
        document.querySelector('.scroll-to-top-button').style.display = 'block';
    } else {
        document.querySelector('.scroll-to-top-button').style.display = 'none';
    }

}
/////////////////////////////////////////////////////////////////////////////////////////






/* ---------------------- OTVARANJE I ZATVARANJE KORPE -------------------*/
const cartIcon = document.querySelector('.cart-icon');
const closeButton = document.querySelector('.x');
const cartToggler = document.querySelector('.cart-toggler-wrapper');

// Prikaz korpe klikom na cart ikonicu
cartIcon.addEventListener('click', () => {

    cartToggler.style.display = 'block';
    cartToggler.style.animation = 'cartShow .5s ease-out'
    document.body.classList.add('disable-scroll');
    document.documentElement.classList.add('disable-scroll');
    shoppingCart.displayItems(); // Prikaz proizvoda u korpi

});

// Zatvaranje korpe klikom na 'X'
closeButton.addEventListener('click', () => {

    cartToggler.style.display = 'none';
    document.body.classList.remove('disable-scroll');
    document.documentElement.classList.remove('disable-scroll');

});

// Zatvaranje korpe klikom na overlay
cartToggler.addEventListener('click', e => {

     if (e.target === cartToggler) {
        cartToggler.style.display = 'none';
        document.body.classList.remove('disable-scroll');
        document.documentElement.classList.remove('disable-scroll');
    }

});
/////////////////////////////////////////////////////////////////////////////////////////










/* ------------------------------------------------------            SMOOTH SCROLL LISTENERI              ---------------------------------------------------- */
/* -------------------- Smooth scroll sa vrha do 'PRODUCTS' sekcije -------------------- */
document.querySelector('#animate-arrow').addEventListener('click', () => {

    const scrollTarget = document.querySelector('.products-section').offsetTop / 1.1;

    window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
    });

});
/////////////////////////////////////////////////////////////////////////////////////////

/* --------------------- Smooth scroll do 'WHAT WE DO' sekcije --------------------- */
document.querySelector('#learn-more-button').addEventListener('click', () => {

    const scrollTarget = document.querySelector('.what-we-do-section').offsetTop / 1.1;

    window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
    });

});
/////////////////////////////////////////////////////////////////////////////////////////

/* --------------------- Smooth scroll do 'PRODUCTS' sekcije --------------------- */
document.querySelector('#fa-products-section-trigger').addEventListener('click', () => {

    const scrollTarget = document.querySelector('.products-section').offsetTop / 1.1;

    window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
    });

});
/////////////////////////////////////////////////////////////////////////////////////////

/* --------------------- Smooth scroll do 'CUSTOMER REVIEWS' sekcije --------------------- */
document.querySelector('#fa-customer-products-section-trigger').addEventListener('click', () => {

    const scrollTarget = document.querySelector('.customer-reviews-section').offsetTop / 1.03;

    window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
    });

});
/////////////////////////////////////////////////////////////////////////////////////////












/* --------------------- HAMBURGER MENU --------------------- */
const hamburgerMenuIcon = document.querySelector('#hamburger-menu-icon');
const nav = document.querySelector('#navbar');

let isOpen = false; // Globalna varijabla cijom vrijednoscu manipulisemo da bi pravilno otvarali i zatvarali navbar

hamburgerMenuIcon.addEventListener('click', () => {

    if (!isOpen) {
      gsap.to(nav, { top: '100%', opacity: 1, duration: .8, ease: Power4.easeOut });
      isOpen = true;
      document.querySelector('header').style.background = 'rgba(0, 0, 0, 0.9)';
    } else {
      // Ako je trenutno stanje otvoreno, zatvorite meni
      gsap.to(nav, { top: '-100vh', opacity: 0, duration: .3, ease: 'power2.inOut' });
      isOpen = false;
      document.querySelector('header').style.backgroundColor = ''
    }

});

/////////////////////////////////////////////////////////////////////////////////////////

















/*----------------------------------------      AZURIRANJE STRANICE SA PODACIMA O PROIZVODIMA IZ JSON FAJLA      --------------------------------------------*/
function updateProducts(category) {

    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = '';
    
    
    fetch('products.json')
    .then(response => response.json())
    .then(data => {


            // Prolazimo pomocu 'for...in' petlje kroz proizvode i pravimo div koji ce da se popuni proizvodima iz odabrane kategorije
            for (let key in data[category]) {

                if (data[category].hasOwnProperty(key)) {
                    const product = data[category][key];
                    const productHTML = `
                        <div class="single-product">
                            <img src="${product.imgurl}" alt="${product.name}">
                            <h4>${product.name}</h4>
                            <p>${product.description}</p>
                            <h5>$${product.price}</h5> 
                            <button class="add-to-cart-button" data-product-key="${product['data-product-key']}" data-category="${product['data-category']}" ${isProductInCart(product['data-product-key']) ? 'disabled' : ''}>ADD TO CART</button>
                        </div>
                        `;

                    
                    
                    productContainer.innerHTML += productHTML;
                                                

                    // Pomocu GSAP-a animiramo podatke koje smo dohvatili
                    gsap.fromTo(
                    productContainer.children,
                    {
                        rotationY: 270,
                    },
                    {
                        rotationY: 360,
                        duration: 1.6,
                        ease: 'bounce',
                        scrollTrigger: {
                            trigger: productContainer,
                            start: "top bottom",
                            end: "bottom top"
                        }
                    }
                    );

                }
                
            }
            
        
            // Event listeneri za dodavanje svakog pojedinacnog proizvoda u korpu
            const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', e => {
                    const productKey = e.target.getAttribute('data-product-key');
                    const category = e.target.getAttribute('data-category');
                    const selectedProduct = data[category][productKey];
                    shoppingCart.addItem(selectedProduct);
                    
                    update_checkout_removeAll_buttonsStatus()
                    update_addToCartButtonsStatus();
                });
            });
        })
        .catch(error => console.error(`An error occured while fetching the data ${'\n'} ${error}`));

}


// Event listener na 'select' elementu za prikazivanje proizvoda iz izabrane kategorije
const categorySelect = document.getElementById('category-select');
categorySelect.addEventListener('change', e => {

    const selectedCategory = e.target.value;
    updateProducts(selectedCategory);

});

// Po otvaranju stranice inicijalno prikazujemo proizvode iz prve kategorije(CPU)
updateProducts('CPU');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

















// Kreiramo klasu 'Cart' koja predstavlja korpu
class Cart {
    constructor() {
        this.items = [];
    }


    // Metoda za dodavanje proizvoda u korpu
    addItem(product) {

        this.items.push(product);
        this.updateCartBadge();

    }

    
    // Metoda za uklanjanje proizvoda iz korpe na osnovu 'data-product-key'-ja
    removeItem(productKey) {

        // Array.findIndex() metoda pronalazi odredjeni proizvod ciji se 'data-product-key' poklapa sa 'data-product-key'-jem kliknutog button-a
        const indexToRemove = this.items.findIndex(item => item['data-product-key'] === productKey);

        if (indexToRemove !== -1) {
            this.items.splice(indexToRemove, 1); // Uklanjamo proizvod iz niza na odredjenom indeksu
            this.displayItems(); // Azuriramo prikaz korpe nakon uklanjanja proizvoda
            this.updateCartBadge(); // Azuriramo brojac korpe

            // Uklanjanjem zadnjeg preostalog proizvoda resetujemo cijenu na '$0.00'
            if (this.items.length === 0) {
                this.resetTotalPrice();
            }
        }

    }



    // Metoda za prikazivanje proizvoda u korpi
    displayItems() {

        const cartItemsList = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        cartItemsList.innerHTML = '';

        let totalPrice = 0; // Varijabla koja prati ukupnu cijenu. Na pocetku je inicijalizujemo na '$0.00'

        if (this.items.length === 0) {
            // Kada je korpa prazna, prikazujemo tekst 'Your cart is empty'
            const emptyCartMessage = document.createElement('h3');
            emptyCartMessage.textContent = 'Your cart is empty';
            cartItemsList.appendChild(emptyCartMessage);
        } else {
            // Kreiramo html strukturu za svaki dodati proizvod pojedinacno
            this.items.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <img src="${item.imgurl}">
                    <p>${item.name}</p>
                    <p>$${item.price}</p>
                    <div>
                        <button class="remove-from-cart-button" data-product-key="${item['data-product-key']}">
                            <i class="fa-solid fa-trash" title="Remove from cart"></i>
                        </button>
                    </div>
                `;
                cartItemsList.appendChild(listItem);

                // Dodajemo cijenu dodatog proizvoda na ukupnu cijenu
                totalPrice += item.price;

                // Prikazujemo ukupnu cijenu u korpi
                const totalElement = cartSummary.querySelector('h3');
                totalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
        
                // Dodajemo event listenere za svaki pojedinacni 'fa-trash' button za uklanjanje tog proizvoda iz korpe
                const removeButton = listItem.querySelector('.remove-from-cart-button');
                if (removeButton) {
                    const productKeyToRemove = removeButton.getAttribute('data-product-key');
                    removeButton.addEventListener('click', () => {
                        
                        this.removeItem(productKeyToRemove);

                        update_checkout_removeAll_buttonsStatus()
                        update_addToCartButtonsStatus()

                    });
                }
            }); 
        }
    
    }
    
    
    

    // Metoda za azuriranje brojaca proizvoda u korpi
    updateCartBadge() {
        const cartBadge = document.querySelector('.badge');
        cartBadge.style.animation = '';
        cartBadge.textContent = this.items.length;
        setTimeout(() => {
            cartBadge.style.animation = 'badgeMove .5s';
        }, 0);
    }


    // Metoda za azuriranje korpe nakon CHECKOUT-a ili uklanjanja svih proizvoda
    clearCart() {

        this.items = [];
        this.displayItems();
        this.updateCartBadge();
        update_checkout_removeAll_buttonsStatus();

    }


    // Metoda za azuriranje prikaza ukupne cijene
    resetTotalPrice() {

        const totalPriceElement = document.getElementById('total-price');
        totalPriceElement.textContent = 'Total: $0.00';

    }


    // Metoda za disable-ovanje 'CHECKOUT' i 'Remove All' buttona kada je korpa prazna
    isEmpty() {

        return this.items.length === 0;

    }
    
    
}



// KREIRAMO INSTANCU KLASE
const shoppingCart = new Cart();





// Azuriramo status 'CHECKOUT' i 'Remove All' buttona u korpi po otvaranju stranice
const checkoutButton = document.getElementById('checkout-button');
const clearCartButton = document.getElementById('clear-cart-button');
update_checkout_removeAll_buttonsStatus();



// Simuliramo porudzbinu
checkoutButton.addEventListener('click', () => {
    
    document.querySelector('#loader').style.display = 'flex';
    checkoutButton.disabled = true;
    clearCartButton.disabled = true;
    
    setTimeout(() => {
        alert('Your order has been successfully processed');
        shoppingCart.clearCart();
        shoppingCart.resetTotalPrice();
        update_addToCartButtonsStatus();
        document.querySelector('#loader').style.display = 'none';
        cartToggler.style.display = 'none';
        document.body.classList.remove('disable-scroll');
        document.documentElement.classList.remove('disable-scroll');
    }, 5000);
    
});



// Praznimo korpu
clearCartButton.addEventListener('click', () => {
    
    shoppingCart.clearCart();
    shoppingCart.resetTotalPrice();
    update_addToCartButtonsStatus();

});







/* Funkcija za omogucavanje ili onemogucavanje 'CHECKOUT' i 'Remove All' buttona
na osnovu stanja korpe */ 
function update_checkout_removeAll_buttonsStatus() {


    if (shoppingCart.isEmpty()) {
        checkoutButton.disabled = true;
        clearCartButton.disabled = true;
    } else {
        checkoutButton.disabled = false;
        clearCartButton.disabled = false;
    }

}




/* Funkcija za omogucavanje ili onemogucavanje pojedinacnog 'ADD TO CART' button-a
na osnovu toga da li je taj proizvod vec u korpi */
function update_addToCartButtonsStatus() {

    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
    addToCartButtons.forEach(button => {

        const productKey = button.getAttribute('data-product-key'); 
        button.disabled = isProductInCart(productKey);

    });

}





// Funkcija za provjeravanje da li je proizvod dodat u korpu da bismo manipulisali stanjem 'ADD TO CART' buttona
function isProductInCart(productKey) {

    /* Array.some() metoda prolazi kroz proizvode u korpi i u slucaju da u njoj postoji proizvod ciji se 'data-product-key'
       poklapa sa 'data-product-key'-jem odredjenog button-a, ona vraca boolean 'true' i postavlja vrijednost
       'disabled' atributa button-a na 'true' i obrnuto */
    return shoppingCart.items.some(item => item['data-product-key'] === productKey);

}