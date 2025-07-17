// Global variables
let cart = [];
let invoiceCounter = 1;

// Sample data
const sampleProducts = [
    { id: 1, name: 'Chocolate Cake', price: 15.99, image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&dpr=2' },
    { id: 2, name: 'Premium Coffee', price: 4.99, image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&dpr=2' },
    { id: 3, name: 'Club Sandwich', price: 12.99, image: 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&dpr=2' },
    { id: 4, name: 'Fresh Juice', price: 6.99, image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&dpr=2' },
    { id: 5, name: 'Pasta', price: 18.99, image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&dpr=2' },
    { id: 6, name: 'Ice Cream', price: 8.99, image: 'https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&dpr=2' }
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize page-specific functionality
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'index.html':
            initializeDashboard();
            break;
        case 'pos.html':
            initializePOS();
            break;
        case 'inventory.html':
            initializeInventory();
            break;
        case 'invoices.html':
            initializeInvoices();
            break;
    }
    
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.bg-white');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 100}ms`;
        card.classList.add('fade-in');
    });
});

// Dashboard functionality
function initializeDashboard() {
    initializeSalesChart();
    
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.bg-white');
    statCards.forEach(card => {
        card.classList.add('card-hover');
    });
}

function initializeSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Sales',
                data: [12000, 15000, 18000, 22000, 25000, 28000],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// POS System functionality
function initializePOS() {
    const productItems = document.querySelectorAll('.product-item');
    const sellButton = document.getElementById('sellButton');
    const clearCartButton = document.getElementById('clearCart');
    const productSearch = document.getElementById('productSearch');
    
    // Add product to cart
    productItems.forEach(item => {
        item.addEventListener('click', function() {
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            addToCart(name, price);
        });
    });
    
    // Sell button functionality
    if (sellButton) {
        sellButton.addEventListener('click', function() {
            if (cart.length > 0) {
                processSale();
            }
        });
    }
    
    // Clear cart button
    if (clearCartButton) {
        clearCartButton.addEventListener('click', function() {
            cart = [];
            updateCartDisplay();
        });
    }
    
    // Product search
    if (productSearch) {
        productSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            productItems.forEach(item => {
                const productName = item.dataset.name.toLowerCase();
                if (productName.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const sellButton = document.getElementById('sellButton');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-gray-500 text-center py-8">
                <span class="text-4xl">🛒</span>
                <p class="mt-2">No items in cart</p>
            </div>
        `;
        sellButton.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex-1">
                    <h4 class="font-medium text-gray-800">${item.name}</h4>
                    <p class="text-sm text-gray-500">$${item.price.toFixed(2)} each</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="updateQuantity('${item.name}', -1)" class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">-</button>
                    <span class="w-8 text-center font-medium">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)" class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">+</button>
                </div>
            </div>
        `).join('');
        sellButton.disabled = false;
    }
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(cartItem => cartItem.name !== name);
        }
        updateCartDisplay();
    }
}

function processSale() {
    const customerName = document.getElementById('customerName').value || 'Walk-in Customer';
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    // Create invoice
    const invoice = {
        id: `INV-2025-${String(invoiceCounter++).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        customer: customerName,
        items: [...cart],
        subtotal: subtotal,
        tax: tax,
        total: total,
        status: 'Paid'
    };
    
    // Store invoice in localStorage
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    invoices.push(invoice);
    localStorage.setItem('invoices', JSON.stringify(invoices));
    
    // Show success message
    alert(`Invoice ${invoice.id} created successfully!\nTotal: $${total.toFixed(2)}`);
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    document.getElementById('customerName').value = '';
}

// Inventory functionality
function initializeInventory() {
    const searchInput = document.getElementById('inventorySearch');
    const stockFilter = document.getElementById('stockFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterInventory);
    }
    
    if (stockFilter) {
        stockFilter.addEventListener('change', filterInventory);
    }
}

function filterInventory() {
    const searchTerm = document.getElementById('inventorySearch').value.toLowerCase();
    const stockFilter = document.getElementById('stockFilter').value;
    const rows = document.querySelectorAll('#inventoryTable tr');
    
    rows.forEach(row => {
        const productName = row.cells[0]?.textContent.toLowerCase() || '';
        const stockStatus = row.cells[4]?.textContent.toLowerCase() || '';
        
        const matchesSearch = productName.includes(searchTerm);
        const matchesFilter = stockFilter === 'all' || 
                            (stockFilter === 'low' && stockStatus.includes('low')) ||
                            (stockFilter === 'out' && stockStatus.includes('out')) ||
                            (stockFilter === 'good' && stockStatus.includes('good'));
        
        row.style.display = matchesSearch && matchesFilter ? '' : 'none';
    });
}

// Invoice functionality
function initializeInvoices() {
    const searchInput = document.getElementById('invoiceSearch');
    const dateFilter = document.getElementById('dateFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterInvoices);
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', filterInvoices);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterInvoices);
    }
    
    // Load invoices from localStorage
    loadInvoices();
}

function filterInvoices() {
    const searchTerm = document.getElementById('invoiceSearch').value.toLowerCase();
    const dateFilter = document.getElementById('dateFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const rows = document.querySelectorAll('#invoiceTable tr');
    
    rows.forEach(row => {
        const invoiceId = row.cells[0]?.textContent.toLowerCase() || '';
        const customer = row.cells[2]?.textContent.toLowerCase() || '';
        const date = row.cells[1]?.textContent || '';
        const status = row.cells[5]?.textContent.toLowerCase() || '';
        
        const matchesSearch = invoiceId.includes(searchTerm) || customer.includes(searchTerm);
        const matchesDate = !dateFilter || date === dateFilter;
        const matchesStatus = statusFilter === 'all' || status.includes(statusFilter);
        
        row.style.display = matchesSearch && matchesDate && matchesStatus ? '' : 'none';
    });
}

function loadInvoices() {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const tableBody = document.getElementById('invoiceTable');
    
    if (invoices.length === 0 || !tableBody) return;
    
    // Clear existing rows and add new ones
    tableBody.innerHTML = invoices.map(invoice => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#${invoice.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${invoice.date}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${invoice.customer}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${invoice.items.length} items</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${invoice.total.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs rounded-full ${getStatusClass(invoice.status)}">${invoice.status}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="viewInvoiceDetails('${invoice.id}')" class="text-blue-600 hover:text-blue-900 mr-3">View Details</button>
                <button onclick="downloadInvoice('${invoice.id}')" class="text-green-600 hover:text-green-900">📄 PDF</button>
            </td>
        </tr>
    `).join('');
}

function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'paid':
            return 'bg-green-100 text-green-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'overdue':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function viewInvoiceDetails(invoiceId) {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const invoice = invoices.find(inv => inv.id === invoiceId);
    
    if (invoice) {
        const details = `
Invoice ID: ${invoice.id}
Date: ${invoice.date}
Customer: ${invoice.customer}

Items:
${invoice.items.map(item => `- ${item.name} (${item.quantity}x) - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: $${invoice.subtotal.toFixed(2)}
Tax: $${invoice.tax.toFixed(2)}
Total: $${invoice.total.toFixed(2)}
Status: ${invoice.status}
        `;
        
        alert(details);
    }
}

function downloadInvoice(invoiceId) {
    alert(`Downloading invoice ${invoiceId}...`);
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Add loading animation
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50';
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
    
    setTimeout(() => {
        document.body.removeChild(loader);
    }, 1000);
}

// Add notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Handle responsive navigation
function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('nav-mobile');
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                window.location.href = 'index.html';
                break;
            case '2':
                e.preventDefault();
                window.location.href = 'pos.html';
                break;
            case '3':
                e.preventDefault();
                window.location.href = 'inventory.html';
                break;
            case '4':
                e.preventDefault();
                window.location.href = 'invoices.html';
                break;
        }
    }
});

// Add smooth page transitions
window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0';
});