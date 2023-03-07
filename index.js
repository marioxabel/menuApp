import { menuArray } from "/data.js"

const menuSection = document.getElementById("menu-section")
const orderInfo = document.getElementById("order-info")
const totalSection = document.getElementById("total")
const orderBtn = document.getElementById("order-button")
const modal = document.getElementById("modal")
const payButton = document.getElementById("payButton")
const orderSection = document.getElementById("order-section")
const name = document.getElementById("name")


let orderArray = []

// Create orders array if no local storage
if (!localStorage.getItem("order")) {
    // New array for saving order info
    menuArray.forEach(item => {
        orderArray.push({
            name: item.name,
            id: item.id,
            price: item.price,
            quantity: 0,
        })
    })
} else {
    orderArray = JSON.parse(localStorage.getItem("order"))  
}

// Buttons event listener
document.addEventListener("click", function(e) {
    // Add to order button 
    if (e.target.dataset.plusId) {
        addToOrder(e.target.dataset.plusId)
    }
    // Remove from order button
    else if (e.target.dataset.minusId) {
        removeOneFromOrder(e.target.dataset.minusId)
    }
    // Remove all of item
    else if (e.target.dataset.remove) {
        removeFromOrder(e.target.dataset.remove)
    } 
    // Show modal
    else if (e.target === orderBtn) {
        modal.style.visibility = "visible"
    }
    else if (e.target === payButton) {
        e.preventDefault()
        displayThanks()
    }
})

function addToOrder(id) {
    const targetItemObj = orderArray.filter(function(item) {
        return item.id == id
    })[0]
    targetItemObj.quantity++
    saveToLocalStorage()
    render()
}

function removeOneFromOrder(id) {
    const targetItemObj = orderArray.filter(function(item) {
        return item.id == id
    })[0]
    if (targetItemObj.quantity > 0) {
        targetItemObj.quantity-- 
    }
    saveToLocalStorage()
    render()
}

function removeFromOrder(id) {
    const targetItemObj = orderArray.filter(function(item) {
        return item.id == id
    })[0]
    targetItemObj.quantity = 0
    saveToLocalStorage()
    render()
    
}
    
function displayThanks() {
    modal.style.visibility = "hidden"
    orderSection.innerHTML = `
                            <div class="Thanks">
                                <h1>Thanks, ${name.value}! your order is on its way!<h1>
                            </div>
                            `
}

function saveToLocalStorage() {
    localStorage.setItem("order", JSON.stringify(orderArray))
}


function render() {
    let menuHTML = ""
    let orderHTML = ""
    menuArray.forEach(function(item, index) {
        // Display ingredients nicely
        let ingredients = Object.values(item.ingredients)
        ingredients = ingredients.join(', ')
        
        //Disable minus button for not ordered items
        let isOrdered = "disabled"
        if (orderArray[index].quantity > 0) {
            isOrdered = ""
        }
        
        // create menu HTML
        menuHTML +=  `
                    <div class="menuHTML section">
                        <p class="emoji">${item.emoji}</p>
                        <div class="itemInfo">
                            <h2>${item.name}</h2>
                            <p>${ingredients}</p>
                            <p class="price">$${item.price}</p>
                        </div>
                        <div class="buttons">
                            <button data-plus-id="${item.id}">+</button>
                            <button class="${isOrdered}" id="minus-${item.id}" data-minus-id="${item.id}">-</button>
                        </div>
                    </div>
                    ` 
    });
    menuSection.innerHTML = menuHTML
    

    // Order HTML
    orderArray.forEach(function(item) {
        if (item.quantity > 0) {
            orderHTML += `
                <div class="orderHTML">
                    <div class="itemInfoOrder">
                        <h2>${item.name}</h2>
                        <p class="remove" data-remove="${item.id}">remove<p>
                    </div>
                    <div class="orderInfoPrice">
                        <p class="resume remove">quantity: ${item.quantity}</p>
                        <p class="price resume perItem">$${item.price * item.quantity}</p>
                    </div>
                </div>
                `
        }
    })
    orderInfo.innerHTML = orderHTML
    
    // Total HTML
    let total = 0
    orderArray.forEach(function(item) {
        total += item.quantity * item.price
    })
    
    totalSection.innerHTML = `
                            <div class="section orderResume total">
                                <h2>Total Price</h2>
                                <p class="price">$${total}</p>
                            </div>
                            `

    // Complete order button logic
    let buttonDisable = "disabledOrder"
    if (total === 0) {
        orderBtn.classList.add(buttonDisable)
    
        orderBtn.classList.remove(buttonDisable)
    }
}

render()

