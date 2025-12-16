// ============================================
// BACKOFFICE - CONTROL VIAL SAN PEDRO
// Complete Functionality
// ============================================

// Global State
let currentUser = null;
let currentModule = 'dashboard';
let wizardStep = 1;
let tagRequestData = {};

// Mock Data
let userData = {
    id: 1,
    nombre: 'Juan',
    apellidoPaterno: 'Pérez',
    apellidoMaterno: 'García',
    curp: 'PEGJ850101HDFRRN01',
    rfc: 'PEGJ850101ABC',
    email: 'usuario@email.com',
    telefono: '+52 81 1234 5678',
    fechaRegistro: new Date('2025-01-01')
};

let addresses = [];
let vehicles = [];
let requests = [];
let payments = [];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Load data from localStorage if exists
    loadDataFromStorage();

    // Setup event listeners
    setupEventListeners();

    // Check if user is logged in
    if (localStorage.getItem('userLoggedIn') === 'true') {
        showApp();
    } else {
        showLoginScreen();
    }
});

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const module = e.currentTarget.getAttribute('data-module');
            switchModule(module);
        });
    });

    // Quick actions
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const module = e.currentTarget.getAttribute('data-module');
            switchModule(module);
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleSidebar);
    }

    // User menu
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', toggleUserMenu);
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Payment form
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePayment);
    }

    // Delivery options
    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', updateDeliveryCost);
    });

    // FAQ items
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.parentElement;
            faqItem.classList.toggle('active');
        });
    });
}

// ============================================
// AUTHENTICATION
// ============================================

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (email && password) {
        currentUser = userData;
        currentUser.email = email;
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        showApp();
        showNotification('Bienvenido de vuelta', 'success');
    }
}

function handleLogout(e) {
    e.preventDefault();
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        localStorage.removeItem('userLoggedIn');
        currentUser = null;
        showLoginScreen();
        showNotification('Sesión cerrada exitosamente', 'success');
    }
}

function showLoginScreen() {
    document.getElementById('login-screen').classList.add('active');
    document.getElementById('app').classList.remove('active');
}

function showApp() {
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('app').classList.add('active');
    updateUserInfo();
    switchModule('dashboard');
}

function updateUserInfo() {
    const userName = `${currentUser.nombre} ${currentUser.apellidoPaterno}`;
    document.getElementById('topbarUserName').textContent = userName;
    updateDashboardStats();
}

// ============================================
// NAVIGATION
// ============================================

function switchModule(moduleName) {
    // Update active module
    currentModule = moduleName;

    // Hide all modules
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));

    // Show selected module
    const selectedModule = document.getElementById(`module-${moduleName}`);
    if (selectedModule) {
        selectedModule.classList.add('active');
    }

    // Update sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.getAttribute('data-module') === moduleName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Load module data
    loadModuleData(moduleName);

    // Close mobile sidebar if open
    closeSidebar();
}

function loadModuleData(moduleName) {
    switch (moduleName) {
        case 'dashboard':
            updateDashboardStats();
            break;
        case 'profile':
            loadProfileData();
            break;
        case 'addresses':
            loadAddressesTable();
            break;
        case 'vehicles':
            loadVehiclesTable();
            break;
        case 'request-tag':
            initTagRequestWizard();
            break;
        case 'requests':
            loadRequestsTable();
            break;
        case 'payments':
            loadPaymentsTable();
            break;
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('active');
}

function toggleUserMenu() {
    document.getElementById('userDropdown').classList.toggle('active');
}

// ============================================
// DASHBOARD
// ============================================

function updateDashboardStats() {
    document.getElementById('statVehicles').textContent = vehicles.length;
    document.getElementById('statRequests').textContent = requests.filter(r => r.estado !== 'completado').length;
    document.getElementById('statPayments').textContent = `$${payments.reduce((sum, p) => sum + p.monto, 0).toLocaleString()}`;
    document.getElementById('statAddresses').textContent = addresses.length;

    // Update activity list
    updateActivityList();
}

function updateActivityList() {
    const activityList = document.getElementById('activityList');
    const activities = [];

    // Add recent requests
    requests.slice(0, 3).forEach(req => {
        activities.push({
            icon: 'info',
            title: `Solicitud ${req.folio} - ${req.estado}`,
            time: formatDate(req.fechaSolicitud)
        });
    });

    // Add recent vehicles
    vehicles.slice(0, 2).forEach(veh => {
        activities.push({
            icon: 'success',
            title: `Vehículo registrado: ${veh.marca} ${veh.modelo}`,
            time: 'Reciente'
        });
    });

    if (activities.length === 0) {
        activityList.innerHTML = '<div class="empty-state" style="padding: 20px;">No hay actividad reciente</div>';
        return;
    }

    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.icon}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// ============================================
// PROFILE
// ============================================

function loadProfileData() {
    document.getElementById('profileName').textContent =
        `${currentUser.nombre} ${currentUser.apellidoPaterno} ${currentUser.apellidoMaterno}`;
    document.getElementById('profileCurp').textContent = currentUser.curp;
    document.getElementById('profileRfc').textContent = currentUser.rfc || 'No especificado';
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profilePhone').textContent = currentUser.telefono;
    document.getElementById('profileRegistered').textContent = formatDate(currentUser.fechaRegistro);
}

function editProfile() {
    showNotification('Función de edición de perfil próximamente', 'info');
}

// ============================================
// ADDRESSES
// ============================================

function loadAddressesTable() {
    const tbody = document.getElementById('addressesTable');

    if (addresses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No hay direcciones registradas</td></tr>';
        return;
    }

    tbody.innerHTML = addresses.map(addr => `
        <tr>
            <td><strong>${addr.nombre || 'Dirección'}</strong></td>
            <td>${addr.calle} ${addr.numeroExterior}${addr.numeroInterior ? ' Int. ' + addr.numeroInterior : ''}</td>
            <td>${addr.predial}</td>
            <td class="table-actions">
                <button class="btn btn-sm btn-secondary" onclick="editAddress(${addr.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteAddress(${addr.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function openAddressModal(addressId = null) {
    const modal = document.getElementById('addressModal');
    const form = document.getElementById('addressForm');
    const title = document.getElementById('addressModalTitle');

    form.reset();

    if (addressId) {
        const address = addresses.find(a => a.id === addressId);
        if (address) {
            title.textContent = 'Editar Dirección';
            document.getElementById('addressId').value = address.id;
            document.getElementById('addressName').value = address.nombre || '';
            document.getElementById('addressPredial').value = address.predial;
            document.getElementById('addressStreet').value = address.calle;
            document.getElementById('addressExterior').value = address.numeroExterior;
            document.getElementById('addressInterior').value = address.numeroInterior || '';
        }
    } else {
        title.textContent = 'Agregar Dirección';
        document.getElementById('addressId').value = '';
    }

    openModal('addressModal');
}

function saveAddress() {
    const id = document.getElementById('addressId').value;
    const addressData = {
        nombre: document.getElementById('addressName').value,
        predial: document.getElementById('addressPredial').value,
        calle: document.getElementById('addressStreet').value,
        numeroExterior: document.getElementById('addressExterior').value,
        numeroInterior: document.getElementById('addressInterior').value
    };

    if (id) {
        // Edit existing
        const index = addresses.findIndex(a => a.id == id);
        addresses[index] = { ...addresses[index], ...addressData };
        showNotification('Dirección actualizada exitosamente', 'success');
    } else {
        // Add new
        addresses.push({
            id: Date.now(),
            ...addressData
        });
        showNotification('Dirección agregada exitosamente', 'success');
    }

    saveDataToStorage();
    loadAddressesTable();
    closeModal('addressModal');
}

function editAddress(id) {
    openAddressModal(id);
}

function deleteAddress(id) {
    if (confirm('¿Estás seguro de eliminar esta dirección?')) {
        addresses = addresses.filter(a => a.id !== id);
        saveDataToStorage();
        loadAddressesTable();
        showNotification('Dirección eliminada', 'success');
    }
}

// ============================================
// VEHICLES
// ============================================

function loadVehiclesTable() {
    const tbody = document.getElementById('vehiclesTable');

    if (vehicles.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No hay vehículos registrados</td></tr>';
        return;
    }

    tbody.innerHTML = vehicles.map(veh => {
        const statusBadge = veh.estadoTag === 'activo' ? 'badge-success' :
            veh.estadoTag === 'pendiente' ? 'badge-warning' : 'badge-danger';
        const statusText = veh.estadoTag === 'activo' ? 'Activo' :
            veh.estadoTag === 'pendiente' ? 'Pendiente' : 'Sin Tag';

        return `
            <tr>
                <td><strong>${veh.marca} ${veh.modelo}</strong><br><small>${veh.año} - ${veh.color}</small></td>
                <td>${veh.placa || 'Pendiente'}</td>
                <td>${veh.niv}</td>
                <td><span class="badge ${statusBadge}">${statusText}</span></td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editVehicle(${veh.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteVehicle(${veh.id})">Eliminar</button>
                </td>
            </tr>
        `;
    }).join('');
}

function openVehicleModal(vehicleId = null) {
    const modal = document.getElementById('vehicleModal');
    const form = document.getElementById('vehicleForm');
    const title = document.getElementById('vehicleModalTitle');
    const addressSelect = document.getElementById('vehicleAddress');

    form.reset();

    // Populate address dropdown
    addressSelect.innerHTML = '<option value="">Selecciona una dirección</option>' +
        addresses.map(a => `<option value="${a.id}">${a.nombre || a.calle + ' ' + a.numeroExterior}</option>`).join('');

    if (vehicleId) {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (vehicle) {
            title.textContent = 'Editar Vehículo';
            document.getElementById('vehicleId').value = vehicle.id;
            document.getElementById('vehicleMake').value = vehicle.marca;
            document.getElementById('vehicleModel').value = vehicle.modelo;
            document.getElementById('vehicleYear').value = vehicle.año;
            document.getElementById('vehicleColor').value = vehicle.color;
            document.getElementById('vehicleNiv').value = vehicle.niv;
            document.getElementById('vehiclePlate').value = vehicle.placa || '';
            addressSelect.value = vehicle.direccionId;
        }
    } else {
        title.textContent = 'Agregar Vehículo';
        document.getElementById('vehicleId').value = '';
    }

    openModal('vehicleModal');
}

function saveVehicle() {
    const id = document.getElementById('vehicleId').value;
    const vehicleData = {
        marca: document.getElementById('vehicleMake').value,
        modelo: document.getElementById('vehicleModel').value,
        año: parseInt(document.getElementById('vehicleYear').value),
        color: document.getElementById('vehicleColor').value,
        niv: document.getElementById('vehicleNiv').value,
        placa: document.getElementById('vehiclePlate').value,
        direccionId: parseInt(document.getElementById('vehicleAddress').value)
    };

    if (id) {
        // Edit existing
        const index = vehicles.findIndex(v => v.id == id);
        vehicles[index] = { ...vehicles[index], ...vehicleData };
        showNotification('Vehículo actualizado exitosamente', 'success');
    } else {
        // Add new
        vehicles.push({
            id: Date.now(),
            ...vehicleData,
            estadoTag: 'sin_tag',
            tagRfid: null,
            fechaRegistro: new Date()
        });
        showNotification('Vehículo agregado exitosamente', 'success');
    }

    saveDataToStorage();
    loadVehiclesTable();
    closeModal('vehicleModal');
}

function editVehicle(id) {
    openVehicleModal(id);
}

function deleteVehicle(id) {
    if (confirm('¿Estás seguro de eliminar este vehículo?')) {
        vehicles = vehicles.filter(v => v.id !== id);
        saveDataToStorage();
        loadVehiclesTable();
        showNotification('Vehículo eliminado', 'success');
    }
}

// ============================================
// TAG REQUEST WIZARD
// ============================================

function initTagRequestWizard() {
    wizardStep = 1;
    tagRequestData = {};
    updateWizardUI();
    populateTagVehicleSelect();
    populateTagAddressSelect();
}

function populateTagVehicleSelect() {
    const select = document.getElementById('tagVehicleSelect');
    const availableVehicles = vehicles.filter(v => v.estadoTag !== 'activo');

    select.innerHTML = '<option value="">Selecciona un vehículo</option>' +
        availableVehicles.map(v =>
            `<option value="${v.id}">${v.marca} ${v.modelo} - ${v.placa || v.niv}</option>`
        ).join('');
}

function populateTagAddressSelect() {
    const select = document.getElementById('tagAddressSelect');
    select.innerHTML = '<option value="">Selecciona una dirección</option>' +
        addresses.map(a =>
            `<option value="${a.id}">${a.nombre || a.calle + ' ' + a.numeroExterior}</option>`
        ).join('');
}

function nextWizardStep() {
    // Validate current step
    if (wizardStep === 1) {
        const vehicleId = document.getElementById('tagVehicleSelect').value;
        if (!vehicleId) {
            showNotification('Selecciona un vehículo', 'error');
            return;
        }
        tagRequestData.vehicleId = parseInt(vehicleId);
        tagRequestData.vehicle = vehicles.find(v => v.id == vehicleId);
    } else if (wizardStep === 2) {
        const addressId = document.getElementById('tagAddressSelect').value;
        if (!addressId) {
            showNotification('Selecciona una dirección', 'error');
            return;
        }
        tagRequestData.addressId = parseInt(addressId);
    } else if (wizardStep === 3) {
        const delivery = document.querySelector('input[name="delivery"]:checked').value;
        tagRequestData.deliveryMethod = delivery;
        tagRequestData.deliveryCost = delivery === 'delivery' ? 150 : 0;
        tagRequestData.amount = 100 + tagRequestData.deliveryCost;
    }

    wizardStep++;
    updateWizardUI();
}

function prevWizardStep() {
    wizardStep--;
    updateWizardUI();
}

function updateWizardUI() {
    // Update step indicators
    document.querySelectorAll('.wizard-step').forEach((step, index) => {
        if (index + 1 < wizardStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index + 1 === wizardStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });

    // Update panels
    document.querySelectorAll('.wizard-panel').forEach((panel, index) => {
        if (index + 1 === wizardStep) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });
}

function updateDeliveryCost() {
    const delivery = document.querySelector('input[name="delivery"]:checked').value;
    const deliveryCostItem = document.getElementById('deliveryCostItem');
    const totalAmount = document.getElementById('totalAmount');

    if (delivery === 'delivery') {
        deliveryCostItem.style.display = 'flex';
        totalAmount.textContent = '$250.00 MXN';
    } else {
        deliveryCostItem.style.display = 'none';
        totalAmount.textContent = '$100.00 MXN';
    }
}

function handlePayment(e) {
    e.preventDefault();

    // Create request
    const folio = `REG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;

    const request = {
        id: Date.now(),
        folio: folio,
        vehiculoId: tagRequestData.vehicleId,
        tipoEntrega: tagRequestData.deliveryMethod,
        direccionEntrega: tagRequestData.addressId,
        monto: tagRequestData.amount,
        estado: 'procesando',
        fechaSolicitud: new Date(),
        fechaActualizacion: new Date(),
        timeline: [
            { fecha: new Date(), estado: 'Solicitud Recibida', descripcion: 'Tu solicitud ha sido registrada' },
            { fecha: new Date(), estado: 'Pago Confirmado', descripcion: 'El pago ha sido procesado exitosamente' }
        ]
    };

    requests.push(request);

    // Create payment
    const payment = {
        id: Date.now(),
        solicitudId: request.id,
        folio: folio,
        concepto: 'Tag RFID + ' + (tagRequestData.deliveryMethod === 'delivery' ? 'Envío DHL' : 'Recoger en módulo'),
        monto: tagRequestData.amount,
        metodoPago: 'tarjeta',
        estado: 'completado',
        fecha: new Date()
    };

    payments.push(payment);

    // Update vehicle status
    const vehicle = vehicles.find(v => v.id === tagRequestData.vehicleId);
    if (vehicle) {
        vehicle.estadoTag = 'pendiente';
        vehicle.tagRfid = `TAG-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
    }

    saveDataToStorage();

    showNotification(`¡Pago procesado! Folio: ${folio}`, 'success');

    setTimeout(() => {
        switchModule('requests');
    }, 1500);
}

// ============================================
// REQUESTS
// ============================================

function loadRequestsTable() {
    const tbody = document.getElementById('requestsTable');

    if (requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No hay solicitudes registradas</td></tr>';
        return;
    }

    tbody.innerHTML = requests.map(req => {
        const vehicle = vehicles.find(v => v.id === req.vehiculoId);
        const vehicleName = vehicle ? `${vehicle.marca} ${vehicle.modelo}` : 'Desconocido';

        const statusBadge = req.estado === 'completado' ? 'badge-success' :
            req.estado === 'procesando' ? 'badge-info' :
                req.estado === 'enviado' ? 'badge-warning' : 'badge-danger';

        return `
            <tr>
                <td><strong>${req.folio}</strong></td>
                <td>${vehicleName}</td>
                <td>${formatDate(req.fechaSolicitud)}</td>
                <td><span class="badge ${statusBadge}">${req.estado.toUpperCase()}</span></td>
                <td>$${req.monto.toFixed(2)} MXN</td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-secondary" onclick="viewRequestDetails(${req.id})">Ver Detalles</button>
                </td>
            </tr>
        `;
    }).join('');
}

function viewRequestDetails(requestId) {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    const vehicle = vehicles.find(v => v.id === request.vehiculoId);
    const vehicleName = vehicle ? `${vehicle.marca} ${vehicle.modelo}` : 'Desconocido';

    const detailsDiv = document.getElementById('requestDetails');
    detailsDiv.innerHTML = `
        <div class="info-grid">
            <div class="info-item">
                <label>Folio</label>
                <div class="info-value">${request.folio}</div>
            </div>
            <div class="info-item">
                <label>Vehículo</label>
                <div class="info-value">${vehicleName}</div>
            </div>
            <div class="info-item">
                <label>Método de Entrega</label>
                <div class="info-value">${request.tipoEntrega === 'delivery' ? 'Envío a Domicilio' : 'Recoger en Módulo'}</div>
            </div>
            <div class="info-item">
                <label>Monto</label>
                <div class="info-value">$${request.monto.toFixed(2)} MXN</div>
            </div>
        </div>
    `;

    const timelineDiv = document.getElementById('requestTimeline');
    timelineDiv.innerHTML = request.timeline.map(item => `
        <div class="timeline-item">
            <div class="timeline-date">${formatDate(item.fecha)}</div>
            <div class="timeline-title">${item.estado}</div>
            <div class="timeline-desc">${item.descripcion}</div>
        </div>
    `).join('');

    openModal('requestModal');
}

// ============================================
// PAYMENTS
// ============================================

function loadPaymentsTable() {
    const tbody = document.getElementById('paymentsTable');

    if (payments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No hay pagos registrados</td></tr>';
        return;
    }

    tbody.innerHTML = payments.map(pago => {
        const statusBadge = pago.estado === 'completado' ? 'badge-success' : 'badge-warning';

        return `
            <tr>
                <td><strong>${pago.folio}</strong></td>
                <td>${pago.concepto}</td>
                <td>${formatDate(pago.fecha)}</td>
                <td>$${pago.monto.toFixed(2)} MXN</td>
                <td><span class="badge ${statusBadge}">${pago.estado.toUpperCase()}</span></td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-secondary" onclick="downloadReceipt('${pago.folio}')">Descargar</button>
                </td>
            </tr>
        `;
    }).join('');
}

function downloadReceipt(folio) {
    showNotification(`Descargando recibo ${folio}...`, 'info');
}

// ============================================
// MODALS
// ============================================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modals on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message, type = 'success') {
    const toast = document.getElementById('toast');
    const messageEl = toast.querySelector('.toast-message');

    messageEl.textContent = message;
    toast.className = `toast ${type} active`;

    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// ============================================
// STORAGE
// ============================================

function saveDataToStorage() {
    localStorage.setItem('addresses', JSON.stringify(addresses));
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    localStorage.setItem('requests', JSON.stringify(requests));
    localStorage.setItem('payments', JSON.stringify(payments));
    updateDashboardStats();
}

function loadDataFromStorage() {
    const storedAddresses = localStorage.getItem('addresses');
    const storedVehicles = localStorage.getItem('vehicles');
    const storedRequests = localStorage.getItem('requests');
    const storedPayments = localStorage.getItem('payments');

    if (storedAddresses) addresses = JSON.parse(storedAddresses);
    if (storedVehicles) {
        vehicles = JSON.parse(storedVehicles);
        // Convert date strings back to Date objects
        vehicles.forEach(v => {
            if (v.fechaRegistro) v.fechaRegistro = new Date(v.fechaRegistro);
        });
    }
    if (storedRequests) {
        requests = JSON.parse(storedRequests);
        requests.forEach(r => {
            if (r.fechaSolicitud) r.fechaSolicitud = new Date(r.fechaSolicitud);
            if (r.fechaActualizacion) r.fechaActualizacion = new Date(r.fechaActualizacion);
            if (r.timeline) {
                r.timeline.forEach(t => {
                    if (t.fecha) t.fecha = new Date(t.fecha);
                });
            }
        });
    }
    if (storedPayments) {
        payments = JSON.parse(storedPayments);
        payments.forEach(p => {
            if (p.fecha) p.fecha = new Date(p.fecha);
        });
    }
}

// ============================================
// UTILITIES
// ============================================

function formatDate(date) {
    if (!date) return '-';
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ============================================
// INITIALIZE DEMO DATA
// ============================================

function initDemoData() {
    if (addresses.length === 0) {
        addresses.push({
            id: 1,
            nombre: 'Casa Principal',
            predial: '12345-67890',
            calle: 'Av. Ejemplo',
            numeroExterior: '123',
            numeroInterior: '',
        });
    }

    if (vehicles.length === 0) {
        vehicles.push({
            id: 1,
            marca: 'Toyota',
            modelo: 'Camry',
            año: 2022,
            color: 'Blanco',
            niv: '1HGBH41JXMN109186',
            placa: 'ABC-123',
            direccionId: 1,
            estadoTag: 'activo',
            tagRfid: 'TAG-001234',
            fechaRegistro: new Date()
        });
    }

    saveDataToStorage();
}

// Initialize demo data on first load
if (localStorage.getItem('userLoggedIn') === 'true' && vehicles.length === 0) {
    initDemoData();
}

console.log('Backoffice Control Vial initialized successfully');
