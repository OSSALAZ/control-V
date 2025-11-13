// Estado de la aplicación
let currentUser = null;
let currentVehicleId = null;
let currentAddressId = null;
let tagRequestData = null;

// Datos de ejemplo
const mockUser = {
    name: 'Juan Pérez García',
    email: 'usuario@email.com',
    curp: 'PEGJ850101HDFRRN01',
    phone: '+52 81 1234 5678',
    addresses: [
        {
            id: 1,
            name: 'Dirección Principal',
            street: 'Av. Ejemplo',
            exterior: '123',
            interior: '',
            predial: '12345-67890',
            full: 'Av. Ejemplo 123, Col. Centro'
        }
    ],
    vehicles: [
        {
            id: 1,
            make: 'Toyota',
            model: 'Camry',
            plate: 'ABC-123',
            niv: '1HGBH41JXMN109186',
            rfid: 'TAG-001234',
            status: 'active'
        }
    ]
};

// Navegación entre pantallas
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    
    // Actualizar navegación activa
    if (screenId === 'main-screen') {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelectorAll('.nav-item')[0].classList.add('active');
    }
}

function showLogin() {
    showScreen('login-screen');
}

function showRegister() {
    showScreen('register-screen');
}

function showMain() {
    showScreen('main-screen');
    updateUserInfo();
}

function showMyAccount() {
    showScreen('account-screen');
    updateAccountInfo();
}

function showVehicles() {
    showScreen('vehicles-screen');
    updateVehiclesList();
    updateNavActive(1);
}

function showCenters() {
    showScreen('centers-screen');
    updateNavActive(2);
}

function showTagRequest() {
    showScreen('tag-request-screen');
    updateTagRequestForm();
}

function showAddVehicle() {
    currentVehicleId = null;
    document.getElementById('vehicle-form-title').textContent = 'Registrar Vehículo';
    document.getElementById('vehicle-form').reset();
    showScreen('vehicle-form-screen');
}

function updateNavActive(index) {
    document.querySelectorAll('.nav-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

// Login
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    // Simulación de login
    currentUser = { ...mockUser, email };
    showMain();
}

// Registro
function register(event) {
    event.preventDefault();
    
    const formData = {
        names: document.getElementById('reg-names').value,
        paternal: document.getElementById('reg-paternal').value,
        maternal: document.getElementById('reg-maternal').value,
        curp: document.getElementById('reg-curp').value,
        rfc: document.getElementById('reg-rfc').value,
        phone: document.getElementById('reg-phone').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value
    };
    
    // Validación básica
    if (!formData.names || !formData.paternal || !formData.curp || !formData.phone || !formData.email || !formData.password) {
        alert('Por favor completa todos los campos obligatorios');
        return;
    }
    
    // Simular registro exitoso
    // En una aplicación real, aquí se haría una llamada al servidor
    
    // Mostrar mensaje de éxito
    showSuccessMessage('¡Registro exitoso!', 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.');
    
    // Limpiar formulario
    document.getElementById('register-form').reset();
    
    // Redirigir al login después de 2 segundos
    setTimeout(() => {
        showLogin();
    }, 2000);
}

// Función para mostrar mensaje de éxito
function showSuccessMessage(title, message) {
    // Crear overlay de mensaje
    const overlay = document.createElement('div');
    overlay.id = 'success-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 414px;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(4px);
    `;
    
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 2rem;
        max-width: 320px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        animation: scaleIn 0.3s ease-out;
    `;
    
    messageBox.innerHTML = `
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #34A853 0%, #2E7D32 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 2rem; color: white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
            ✓
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: #1D1D1D; margin-bottom: 0.5rem; letter-spacing: -0.02em;">${title}</h3>
        <p style="font-size: 0.95rem; color: #5F6368; line-height: 1.5; margin: 0;">${message}</p>
    `;
    
    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);
    
    // Remover después de 2 segundos
    setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }, 2000);
}

// Actualizar información del usuario
function updateUserInfo() {
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('user-email').textContent = currentUser.email;
    }
}

function updateAccountInfo() {
    if (currentUser) {
        document.getElementById('account-name').textContent = currentUser.name;
        document.getElementById('account-curp').textContent = currentUser.curp;
        document.getElementById('account-phone').textContent = currentUser.phone;
        document.getElementById('account-email').textContent = currentUser.email;
        
        // Actualizar lista de direcciones
        updateAddressesList();
    }
}

// Gestión de Direcciones
function updateAddressesList() {
    const addressList = document.getElementById('address-list');
    if (currentUser && currentUser.addresses && currentUser.addresses.length > 0) {
        addressList.innerHTML = currentUser.addresses.map(addr => {
            const addressName = addr.name || 'Dirección';
            const addressFull = addr.full || `${addr.street} ${addr.exterior}${addr.interior ? ' Int. ' + addr.interior : ''}`;
            return `
                <div class="address-card">
                    <div class="address-header">
                        <h4>${addressName}</h4>
                        <div class="address-actions">
                            <button class="btn-icon" onclick="editAddress(${addr.id})">✏️</button>
                            <button class="btn-icon" onclick="deleteAddress(${addr.id})">🗑️</button>
                        </div>
                    </div>
                    <p class="address-text">${addressFull}</p>
                    <p class="address-text">Predial: ${addr.predial}</p>
                </div>
            `;
        }).join('');
    } else {
        addressList.innerHTML = '<p style="color: var(--text-gray); text-align: center; padding: 2rem;">No hay direcciones registradas. Presiona el botón + para agregar una.</p>';
    }
}

function showAddAddress() {
    currentAddressId = null;
    document.getElementById('address-form-title').textContent = 'Agregar Dirección';
    document.getElementById('address-form').reset();
    showScreen('address-form-screen');
}

function editAddress(id) {
    const address = currentUser.addresses.find(a => a.id === id);
    if (address) {
        currentAddressId = id;
        document.getElementById('address-form-title').textContent = 'Editar Dirección';
        document.getElementById('address-predial').value = address.predial;
        document.getElementById('address-street').value = address.street;
        document.getElementById('address-exterior').value = address.exterior;
        document.getElementById('address-interior').value = address.interior || '';
        document.getElementById('address-name').value = address.name || '';
        showScreen('address-form-screen');
    }
}

function saveAddress(event) {
    event.preventDefault();
    
    const addressData = {
        predial: document.getElementById('address-predial').value,
        street: document.getElementById('address-street').value,
        exterior: document.getElementById('address-exterior').value,
        interior: document.getElementById('address-interior').value,
        name: document.getElementById('address-name').value
    };
    
    // Construir dirección completa
    const addressFull = `${addressData.street} ${addressData.exterior}${addressData.interior ? ' Int. ' + addressData.interior : ''}`;
    
    if (!currentUser.addresses) {
        currentUser.addresses = [];
    }
    
    if (currentAddressId) {
        // Editar dirección existente
        const index = currentUser.addresses.findIndex(a => a.id === currentAddressId);
        if (index !== -1) {
            currentUser.addresses[index] = {
                ...currentUser.addresses[index],
                ...addressData,
                full: addressFull
            };
        }
    } else {
        // Agregar nueva dirección
        const newAddress = {
            id: Date.now(),
            ...addressData,
            full: addressFull
        };
        currentUser.addresses.push(newAddress);
    }
    
    showMyAccount();
}

function deleteAddress(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
        currentUser.addresses = currentUser.addresses.filter(a => a.id !== id);
        updateAccountInfo();
    }
}

// Gestión de vehículos
function updateVehiclesList() {
    if (currentUser && currentUser.vehicles) {
        const vehiclesList = document.getElementById('vehicles-list');
        if (currentUser.vehicles.length > 0) {
            vehiclesList.innerHTML = currentUser.vehicles.map(vehicle => `
                <div class="vehicle-card">
                    <div class="vehicle-header">
                        <h3>${vehicle.make} ${vehicle.model}</h3>
                        <span class="vehicle-status ${vehicle.status === 'active' ? 'tag-active' : 'tag-pending'}">
                            ${vehicle.status === 'active' ? 'Tag Activo' : 'Tag Pendiente'}
                        </span>
                    </div>
                    <div class="vehicle-info">
                        <p><strong>Placa:</strong> ${vehicle.plate || 'Pendiente'}</p>
                        <p><strong>NIV:</strong> ${vehicle.niv}</p>
                        ${vehicle.rfid ? `<p><strong>RFID:</strong> ${vehicle.rfid}</p>` : ''}
                    </div>
                    <div class="vehicle-actions">
                        <button class="btn-small" onclick="editVehicle(${vehicle.id})">Editar</button>
                        <button class="btn-small btn-danger" onclick="deleteVehicle(${vehicle.id})">Eliminar</button>
                    </div>
                </div>
            `).join('');
        } else {
            vehiclesList.innerHTML = '<p style="color: var(--text-gray); text-align: center; padding: 2rem;">No hay vehículos registrados. Presiona el botón + para agregar uno.</p>';
        }
    }
}

function editVehicle(id) {
    const vehicle = currentUser.vehicles.find(v => v.id === id);
    if (vehicle) {
        currentVehicleId = id;
        document.getElementById('vehicle-form-title').textContent = 'Editar Vehículo';
        document.getElementById('vehicle-make').value = vehicle.make;
        document.getElementById('vehicle-model').value = vehicle.model;
        document.getElementById('vehicle-niv').value = vehicle.niv;
        document.getElementById('vehicle-plate').value = vehicle.plate || '';
        
        // Actualizar selector de direcciones
        const addressSelect = document.getElementById('vehicle-address');
        if (currentUser.addresses && currentUser.addresses.length > 0) {
            addressSelect.innerHTML = '<option value="">Selecciona una dirección</option>' +
                currentUser.addresses.map(a => 
                    `<option value="${a.id}" ${vehicle.addressId === a.id ? 'selected' : ''}>${a.full || a.street + ' ' + a.exterior}</option>`
                ).join('');
        }
        
        showScreen('vehicle-form-screen');
    }
}

function saveVehicle(event) {
    event.preventDefault();
    
    const vehicleData = {
        make: document.getElementById('vehicle-make').value,
        model: document.getElementById('vehicle-model').value,
        niv: document.getElementById('vehicle-niv').value,
        plate: document.getElementById('vehicle-plate').value,
        addressId: document.getElementById('vehicle-address').value
    };
    
    if (!currentUser.vehicles) {
        currentUser.vehicles = [];
    }
    
    if (currentVehicleId) {
        // Editar vehículo existente
        const index = currentUser.vehicles.findIndex(v => v.id === currentVehicleId);
        if (index !== -1) {
            currentUser.vehicles[index] = {
                ...currentUser.vehicles[index],
                ...vehicleData
            };
        }
    } else {
        // Agregar nuevo vehículo
        const newVehicle = {
            id: Date.now(),
            ...vehicleData,
            status: 'pending',
            rfid: null
        };
        currentUser.vehicles.push(newVehicle);
    }
    
    showVehicles();
}

function deleteVehicle(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
        currentUser.vehicles = currentUser.vehicles.filter(v => v.id !== id);
        updateVehiclesList();
    }
}

// Solicitud de Tag
function updateTagRequestForm() {
    // Actualizar lista de vehículos
    const vehicleSelect = document.getElementById('tag-vehicle');
    if (currentUser && currentUser.vehicles) {
        vehicleSelect.innerHTML = '<option value="">Selecciona un vehículo</option>' +
            currentUser.vehicles.map(v => 
                `<option value="${v.id}">${v.make} ${v.model} - ${v.plate || 'Sin placa'}</option>`
            ).join('');
    }
    
    // Actualizar lista de direcciones
    const addressSelect = document.getElementById('tag-address');
    if (currentUser && currentUser.addresses) {
        addressSelect.innerHTML = '<option value="">Selecciona una dirección</option>' +
            currentUser.addresses.map(a => 
                `<option value="${a.id}">${a.full || a.street + ' ' + a.exterior}</option>`
            ).join('');
    }
}

function updateDeliveryCost() {
    const deliveryMethod = document.getElementById('tag-delivery').value;
    const deliveryAddressGroup = document.getElementById('delivery-address-group');
    const deliveryCostRow = document.getElementById('delivery-cost-row');
    const deliveryCost = document.getElementById('delivery-cost');
    const totalCost = document.getElementById('total-cost');
    
    if (deliveryMethod === 'delivery') {
        deliveryAddressGroup.style.display = 'block';
        deliveryCostRow.style.display = 'flex';
        deliveryCost.textContent = '$150.00 MXN';
        totalCost.textContent = '$250.00 MXN';
    } else {
        deliveryAddressGroup.style.display = 'none';
        deliveryCostRow.style.display = 'none';
        totalCost.textContent = '$100.00 MXN';
    }
}

function processTagRequest(event) {
    event.preventDefault();
    
    const vehicleId = document.getElementById('tag-vehicle').value;
    const deliveryMethod = document.getElementById('tag-delivery').value;
    const addressId = document.getElementById('tag-address').value;
    
    if (!vehicleId || !deliveryMethod) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    if (deliveryMethod === 'delivery' && !addressId) {
        alert('Por favor selecciona una dirección de envío');
        return;
    }
    
    const vehicle = currentUser.vehicles.find(v => v.id == vehicleId);
    const totalAmount = deliveryMethod === 'delivery' ? 250 : 100;
    
    tagRequestData = {
        vehicleId: vehicleId,
        vehicle: vehicle,
        deliveryMethod: deliveryMethod,
        addressId: addressId,
        amount: totalAmount,
        deliveryCost: deliveryMethod === 'delivery' ? 150 : 0
    };
    
    showPayment();
}

// Pago
function showPayment() {
    showScreen('payment-screen');
    updatePaymentSummary();
}

function updatePaymentSummary() {
    if (tagRequestData) {
        const paymentDeliveryRow = document.getElementById('payment-delivery-row');
        const paymentDeliveryCost = document.getElementById('payment-delivery-cost');
        const paymentTotal = document.getElementById('payment-total');
        
        if (tagRequestData.deliveryCost > 0) {
            paymentDeliveryRow.style.display = 'flex';
            paymentDeliveryCost.textContent = `$${tagRequestData.deliveryCost.toFixed(2)} MXN`;
        } else {
            paymentDeliveryRow.style.display = 'none';
        }
        
        paymentTotal.textContent = `$${tagRequestData.amount.toFixed(2)} MXN`;
        
        // Actualizar botón de pago
        const payButton = document.querySelector('#payment-form button');
        payButton.textContent = `Pagar $${tagRequestData.amount.toFixed(2)} MXN`;
    }
}

function processPayment(event) {
    event.preventDefault();
    
    const cardNumber = document.getElementById('card-number').value;
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCvv = document.getElementById('card-cvv').value;
    const cardName = document.getElementById('card-name').value;
    
    // Validación básica
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        alert('Por favor completa todos los campos de la tarjeta');
        return;
    }
    
    // Simular procesamiento de pago
    setTimeout(() => {
        // Generar folio
        const folio = `REG-2025-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
        
        // Si es solicitud de tag, actualizar vehículo
        if (tagRequestData && tagRequestData.vehicleId) {
            const vehicle = currentUser.vehicles.find(v => v.id == tagRequestData.vehicleId);
            if (vehicle) {
                vehicle.rfid = `TAG-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
                vehicle.status = tagRequestData.deliveryMethod === 'pickup' ? 'pending' : 'pending_delivery';
            }
        }
        
        // Actualizar detalles de confirmación
        updateConfirmationDetails(folio);
        showConfirmation();
    }, 1000);
}

function showConfirmation() {
    showScreen('confirmation-screen');
}

function updateConfirmationDetails(folio) {
    document.getElementById('confirmation-folio').textContent = folio;
    
    if (tagRequestData && tagRequestData.vehicle) {
        document.getElementById('confirmation-vehicle').textContent = 
            `${tagRequestData.vehicle.make} ${tagRequestData.vehicle.model} - ${tagRequestData.vehicle.plate || 'Sin placa'}`;
        
        const deliveryText = tagRequestData.deliveryMethod === 'pickup' 
            ? 'Recoger en módulo' 
            : 'Envío a domicilio';
        document.getElementById('confirmation-delivery').textContent = deliveryText;
        
        const messageText = tagRequestData.deliveryMethod === 'pickup'
            ? 'Puedes recoger tu tag en cualquiera de nuestros centros de atención. Presenta este folio al personal.'
            : 'Tu tag será enviado a la dirección registrada. Recibirás un correo con el número de guía de DHL.';
        document.getElementById('confirmation-message-text').textContent = messageText;
    }
}

function openMap(centerId) {
    alert(`Funcionalidad de mapa para centro ${centerId} próximamente`);
}

function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        currentUser = null;
        showLogin();
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    }
}

// Formateo de tarjeta de crédito
document.addEventListener('DOMContentLoaded', function() {
    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    const cardExpiry = document.getElementById('card-expiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    const cardCvv = document.getElementById('card-cvv');
    if (cardCvv) {
        cardCvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    
    // Actualizar selector de direcciones en formulario de vehículo
    const vehicleAddressSelect = document.getElementById('vehicle-address');
    if (vehicleAddressSelect) {
        // Se actualizará dinámicamente cuando se edite un vehículo
    }
});
