const form = document.getElementById('customerForm');
const customerTable = document.getElementById('customerTable').getElementsByTagName('tbody')[0];
const sortByPurchasesBtn = document.getElementById('sortByPurchases');
const sortByAmountBtn = document.getElementById('sortByAmount');
const searchBox = document.getElementById('searchBox');

document.addEventListener('DOMContentLoaded', loadCustomers);
form.addEventListener('submit', addCustomer);
sortByPurchasesBtn.addEventListener('click', sortByPurchases);
sortByAmountBtn.addEventListener('click', sortByAmount);
searchBox.addEventListener('input', searchCustomers);

function loadCustomers() {
    let customers = getCustomers();
    displayCustomers(customers);
}

function addCustomer(event) {
    event.preventDefault();
    const productPurchased = document.getElementById('productPurchased').value.trim();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const field = document.getElementById('field').value.trim();
    const customerType = document.getElementById('customerType').value;
    const registeredBy = document.getElementById('registeredBy').value; 
    const date = new Date().toLocaleDateString('en-GB');

    let customers = getCustomers();

    const isDuplicate = customers.some(customer => 
        customer.name === name || customer.phone === phone
    );

    if (isDuplicate) {
        alert("Customer already exists!");
        return;
    }

    const customer = { name, phone, field, customerType, registeredBy, productPurchased, date, purchases: [] };

    customers.push(customer);
    saveCustomers(customers);

    displayCustomers(customers);
    form.reset();
}

function getCustomers() {
    return JSON.parse(localStorage.getItem('customers')) || [];
}

function saveCustomers(customers) {
    localStorage.setItem('customers', JSON.stringify(customers));
}

function displayCustomers(customers) {
    customerTable.innerHTML = '';

    customers.forEach((customer, index) => {
        const row = customerTable.insertRow();

        const purchaseCount = customer.purchases.length;
        const totalAmount = customer.purchases.reduce((sum, p) => sum + p.amount, 0);

        row.innerHTML = `
        <td>${customer.name}</td>
        <td>${customer.phone}</td>
        <td>${customer.field}</td>
        <td>${customer.customerType}</td>
        <td>${customer.registeredBy}</td>
        <td>${customer.productPurchased || '-'}</td>
        <td>${customer.date}</td>
        <td>${purchaseCount}</td>
        <td>${totalAmount.toLocaleString()}</td>
        <td>
            <button onclick="addPurchase(${index})">➕ Add Purchase</button>
            <button onclick="deleteCustomer(${index})" style="background:#ff4d4d;">❌ Delete</button>
        </td>
    `;
    });
}

function addPurchase(index) {
    const amount = prompt('Enter purchase amount (Toman):');
    if (!amount || isNaN(amount)) {
        alert('Please enter a valid amount.');
        return;
    }

    let customers = getCustomers();
    customers[index].purchases.push({
        amount: parseInt(amount),
        date: new Date().toLocaleDateString('en-GB')
    });

    saveCustomers(customers);
    displayCustomers(customers);
}

function deleteCustomer(index) {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    let customers = getCustomers();
    customers.splice(index, 1);
    saveCustomers(customers);
    displayCustomers(customers);
}

function sortByPurchases() {
    let customers = getCustomers();
    customers.sort((a, b) => b.purchases.length - a.purchases.length);
    displayCustomers(customers);
}

function sortByAmount() {
    let customers = getCustomers();
    customers.sort((a, b) => {
        const totalA = a.purchases.reduce((sum, p) => sum + p.amount, 0);
        const totalB = b.purchases.reduce((sum, p) => sum + p.amount, 0);
        return totalB - totalA;
    });
    displayCustomers(customers);
}

function searchCustomers() {
    const query = searchBox.value.toLowerCase();
    let customers = getCustomers();
    const filtered = customers.filter(c => c.name.toLowerCase().includes(query));
    displayCustomers(filtered);
}
