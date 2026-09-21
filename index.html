<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Moonitor Kiosk</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <style>
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { user-select: none; overscroll-behavior: none; }
        @keyframes slideUpFade {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        .toast-animate { animation: slideUpFade 0.3s ease-out forwards; }
    </style>
</head>
<body class="bg-gray-950 text-gray-200 h-screen w-screen overflow-hidden flex flex-col font-sans">

    <!-- Persistent Tab Bar -->
    <nav class="bg-gray-900 shadow-md z-20 flex-shrink-0 border-b border-gray-800 h-14 flex items-end px-2 pt-2">
        <button id="tab-dashboard" onclick="switchTab('dashboard')" class="min-w-[130px] px-4 py-2 h-full flex items-center justify-center gap-2 rounded-t-lg transition-all font-bold text-sm border-b-4 bg-gray-800 text-blue-400 border-blue-500 shadow-md cursor-pointer">
            <i class="ph-fill ph-squares-four text-xl"></i>
            <span>Dashboard</span>
        </button>

        <div id="dynamic-tabs-container" class="flex-1 overflow-x-auto flex items-end hide-scrollbar mx-1 space-x-1 h-full"></div>

        <button id="tab-settings" onclick="switchTab('settings')" class="min-w-[100px] ml-auto px-4 py-2 h-full flex items-center justify-center gap-2 rounded-t-lg transition-all font-bold text-sm border-b-4 bg-transparent text-gray-500 border-transparent hover:bg-gray-800 hover:text-gray-300 cursor-pointer">
            <i class="ph-fill ph-gear text-xl"></i>
            <span class="hidden md:inline">Settings</span>
        </button>
    </nav>

    <main class="flex-1 min-h-0 relative w-full h-full bg-gray-950 flex flex-col">
        <!-- Dashboard View -->
        <div id="view-dashboard" class="flex-1 flex flex-col w-full h-full relative p-2 md:p-4">
            <button id="btn-prev" onclick="prevPage()" class="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-gray-800/90 hover:bg-gray-700 text-white p-3 md:p-4 rounded-r-xl shadow-2xl transition-all border border-l-0 border-gray-600 hidden backdrop-blur-sm cursor-pointer">
                <i class="ph-bold ph-caret-left text-3xl"></i>
            </button>

            <div id="printer-grid" class="flex-1 w-full h-full min-h-0 grid grid-cols-2 md:grid-cols-3 grid-rows-3 gap-2 md:gap-4 transition-opacity duration-300"></div>

            <button id="btn-next" onclick="nextPage()" class="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-gray-800/90 hover:bg-gray-700 text-white p-3 md:p-4 rounded-l-xl shadow-2xl transition-all border border-r-0 border-gray-600 backdrop-blur-sm cursor-pointer">
                <i class="ph-bold ph-caret-right text-3xl"></i>
            </button>

            <div class="h-4 mt-2 flex-shrink-0 flex justify-center items-center gap-2 w-full" id="pagination-dots"></div>
        </div>

        <!-- Webview Placeholder View -->
        <div id="view-webview" class="hidden absolute inset-0 bg-gray-950 flex-col items-center justify-center w-full h-full p-4 md:p-8 z-10">
            <div class="bg-gray-900 border border-gray-800 rounded-2xl w-full h-full flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                <i class="ph ph-browser text-7xl text-gray-700 mb-4"></i>
                <h2 class="text-3xl md:text-4xl font-bold text-gray-100 mb-2 text-center">Mainsail / Fluidd Webview Interface</h2>
                <div class="mt-4 px-6 py-2 bg-gray-950 rounded-full border border-gray-800 flex items-center gap-3">
                    <span class="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                    <span class="text-xl text-gray-300">Connected to: <span id="webview-printer-name" class="font-bold text-white">Printer Name</span></span>
                </div>
            </div>
        </div>

        <!-- Settings View -->
        <div id="view-settings" class="hidden absolute inset-0 bg-gray-950 flex-col w-full h-full p-6 md:p-10 z-10 overflow-y-auto">
            <div class="max-w-4xl mx-auto w-full space-y-6">
                <div>
                    <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                        <i class="ph-fill ph-gear text-blue-500"></i> Kiosk & Network Configuration
                    </h2>
                    <p class="text-gray-400 text-sm mt-1">Manage system network interfaces, Wi-Fi connections, and subnet discovery parameters.</p>
                </div>

                <div class="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
                    <div>
                        <span class="text-xs text-gray-400 uppercase tracking-wider font-semibold">Active Kiosk Address</span>
                        <div id="system-ip-display" class="text-xl font-mono font-bold text-blue-400 mt-0.5">Fetching IP...</div>
                    </div>
                    <button onclick="refreshSystemInfo()" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm font-semibold transition-colors border border-gray-700 cursor-pointer">
                        Refresh IP
                    </button>
                </div>

                <div class="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg space-y-4">
                    <h3 class="text-lg font-bold text-white flex items-center gap-2">
                        <i class="ph-fill ph-wifi text-green-400"></i> Wi-Fi Network Selection
                    </h3>
                    
                    <div class="space-y-2">
                        <label class="text-xs text-gray-400 font-medium">Available SSIDs</label>
                        <select id="wifi-network-select" class="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-blue-500">
                            <option>Scanning networks...</option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label class="text-xs text-gray-400 font-medium">Network Password</label>
                        <input id="wifi-password-input" type="password" placeholder="Enter Wi-Fi password" class="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-blue-500">
                    </div>

                    <div class="pt-2 flex gap-3">
                        <button onclick="connectWifi()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-colors shadow cursor-pointer">
                            Connect Network
                        </button>
                        <button onclick="runSubnetScan()" class="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-bold text-sm transition-colors border border-gray-700 cursor-pointer">
                            Scan Subnet for Printers
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <div id="toast-container" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none"></div>

    <script>
        const aspectRatios = [{ label: '16:9', val: '16/9' }, { label: '4:3', val: '4/3' }, { label: '1:1', val: '1/1' }];
        let printers = Array.from({ length: 14 }, (_, i) => ({
            id: `printer_${i + 1}`,
            name: `Printer ${String(i + 1).padStart(2, '0')}`,
            ratioLabel: aspectRatios[i % aspectRatios.length].label,
            ratioVal: aspectRatios[i % aspectRatios.length].val,
            tempHotend: (Math.random() * (260 - 200) + 200).toFixed(1),
            tempBed: (Math.random() * (100 - 50) + 50).toFixed(1)
        }));

        let activeTabId = 'dashboard';
        let openTabs = printers.map(p => p.id);
        const PAGE_SIZE = 9;
        let currentPage = 0;
        const totalPages = Math.ceil(printers.length / PAGE_SIZE);

        async function initApp() {
            renderTabs();
            renderDashboard();
            refreshSystemInfo();
            loadWifiNetworks();
        }

        async function refreshSystemInfo() {
            const info = await window.electronAPI.getSystemInfo();
            document.getElementById('system-ip-display').innerText = `http://${info.ip}:${info.port}`;
        }

        async function loadWifiNetworks() {
            const networks = await window.electronAPI.getWifiList();
            const select = document.getElementById('wifi-network-select');
            select.innerHTML = networks.map(n => `<option value="${n.ssid}">${n.ssid} (Signal: ${n.signal}%)</option>`).join('');
        }

        async function connectWifi() {
            const ssid = document.getElementById('wifi-network-select').value;
            const password = document.getElementById('wifi-password-input').value;
            const res = await window.electronAPI.connectWifi({ ssid, password });
            showToast(res.success ? `Connected to ${ssid}` : `Connection failed: ${res.error}`);
        }

        async function runSubnetScan() {
            showToast('Scanning subnet for Moonraker API endpoints...');
            const discovered = await window.electronAPI.scanSubnet();
            showToast(`Scan complete. Discovered ${discovered.length} active printers.`);
        }

        function renderTabs() {
            const activeStyle = "px-4 py-2 h-full flex items-center justify-center gap-2 rounded-t-lg transition-all font-bold text-sm border-b-4 bg-gray-800 text-blue-400 border-blue-500 shadow-md";
            const inactiveStyle = "px-4 py-2 h-full flex items-center justify-center gap-2 rounded-t-lg transition-all font-bold text-sm border-b-4 bg-transparent text-gray-500 border-transparent hover:bg-gray-800 hover:text-gray-300";

            document.getElementById('tab-dashboard').className = `min-w-[130px] ${activeTabId === 'dashboard' ? activeStyle : inactiveStyle}`;
            document.getElementById('tab-settings').className = `min-w-[100px] ml-auto ${activeTabId === 'settings' ? activeStyle : inactiveStyle}`;

            let dynamicTabsHTML = '';
            openTabs.forEach(printerId => {
                const printer = printers.find(p => p.id === printerId);
                if (printer) {
                    const isActive = activeTabId === printerId;
                    dynamicTabsHTML += `
                        <div class="flex items-center h-full rounded-t-lg border-b-4 ${isActive ? 'bg-gray-800 border-blue-500 shadow-md' : 'bg-transparent border-transparent hover:bg-gray-800 group'}">
                            <button onclick="switchTab('${printer.id}')" class="px-4 py-2 h-full flex items-center justify-center gap-2 transition-all font-semibold text-sm ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'} cursor-pointer">
                                <i class="ph-fill ph-printer-3d text-lg"></i>
                                <span class="truncate max-w-[100px]">${printer.name}</span>
                            </button>
                            <button onclick="closeTab(event, '${printer.id}')" class="pr-3 pl-1 py-2 h-full flex items-center text-gray-500 hover:text-red-400 transition-colors cursor-pointer">
                                <i class="ph-bold ph-x text-sm"></i>
                            </button>
                        </div>
                    `;
                }
            });
            document.getElementById('dynamic-tabs-container').innerHTML = dynamicTabsHTML;
        }

        function switchTab(tabId) {
            activeTabId = tabId;
            renderTabs();
            document.getElementById('view-dashboard').classList.add('hidden');
            document.getElementById('view-webview').classList.add('hidden');
            document.getElementById('view-webview').classList.remove('flex');
            document.getElementById('view-settings').classList.add('hidden');
            document.getElementById('view-settings').classList.remove('flex');

            if (tabId === 'dashboard') {
                document.getElementById('view-dashboard').classList.remove('hidden');
            } else if (tabId === 'settings') {
                document.getElementById('view-settings').classList.remove('hidden');
                document.getElementById('view-settings').classList.add('flex');
            } else {
                const printer = printers.find(p => p.id === tabId);
                document.getElementById('view-webview').classList.remove('hidden');
                document.getElementById('view-webview').classList.add('flex');
                document.getElementById('webview-printer-name').textContent = printer.name;
            }
        }

        function openFullUI(printerId) {
            if (!openTabs.includes(printerId)) openTabs.push(printerId);
            switchTab(printerId);
        }

        function closeTab(event, printerId) {
            event.stopPropagation();
            openTabs = openTabs.filter(id => id !== printerId);
            if (activeTabId === printerId) switchTab('dashboard');
            else renderTabs();
        }

        function renderDashboard() {
            const grid = document.getElementById('printer-grid');
            const startIdx = currentPage * PAGE_SIZE;
            const pagePrinters = printers.slice(startIdx, startIdx + PAGE_SIZE);

            grid.innerHTML = pagePrinters.map(printer => `
                <div class="relative w-full h-full bg-gray-900 rounded-lg shadow-md border border-gray-800 overflow-hidden group flex items-center justify-center">
                    <div class="absolute inset-0 w-full h-full bg-gray-900 flex items-center justify-center overflow-hidden">
                        <div class="h-full aspect-[${printer.ratioVal}] bg-black flex flex-col items-center justify-center text-gray-500 font-mono select-none shadow-inner border border-gray-800/60">
                            <i class="ph ph-camera text-3xl mb-1 text-gray-600"></i>
                            <span class="text-[11px] uppercase tracking-widest text-gray-400">preview (${printer.ratioLabel})</span>
                        </div>
                    </div>
                    
                    <div class="absolute top-2 left-2 z-10 bg-gray-900/95 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono font-bold text-gray-200 border border-gray-700 shadow flex gap-2">
                        <span>${printer.name}</span>
                        <span class="text-gray-500 border-l border-gray-600 pl-2">${printer.ratioLabel}</span>
                    </div>

                    <div class="absolute inset-0 bg-gray-950/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 flex flex-col justify-center items-center p-2 text-center">
                        <h3 class="text-white font-bold text-xl md:text-2xl mb-4 tracking-wider">${printer.name}</h3>
                        <div class="flex gap-6 md:gap-10 mb-4 md:mb-6">
                            <div class="flex flex-col items-center">
                                <span class="text-[10px] md:text-xs text-orange-400 font-bold uppercase tracking-widest"><i class="ph-fill ph-fire"></i> Hotend</span>
                                <span class="font-mono text-lg md:text-2xl font-bold text-white">${printer.tempHotend}°</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <span class="text-[10px] md:text-xs text-blue-400 font-bold uppercase tracking-widest"><i class="ph-fill ph-thermometer"></i> Bed</span>
                                <span class="font-mono text-lg md:text-2xl font-bold text-white">${printer.tempBed}°</span>
                            </div>
                        </div>
                        <div class="flex gap-3 md:gap-5 mb-4 md:mb-6">
                            <button class="w-12 h-12 rounded-full bg-gray-800 hover:bg-green-600 transition-colors flex items-center justify-center text-white text-xl border border-gray-600 cursor-pointer" onclick="triggerAction(event, '${printer.name}', 'Started')"><i class="ph-fill ph-play"></i></button>
                            <button class="w-12 h-12 rounded-full bg-gray-800 hover:bg-yellow-600 transition-colors flex items-center justify-center text-white text-xl border border-gray-600 cursor-pointer" onclick="triggerAction(event, '${printer.name}', 'Paused')"><i class="ph-fill ph-pause"></i></button>
                            <button class="w-12 h-12 rounded-full bg-gray-800 hover:bg-red-600 transition-colors flex items-center justify-center text-white text-xl border border-gray-600 cursor-pointer" onclick="triggerAction(event, '${printer.name}', 'Stopped')"><i class="ph-fill ph-stop"></i></button>
                        </div>
                        <button onclick="openFullUI('${printer.id}')" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-colors flex justify-center items-center gap-2 shadow-xl cursor-pointer">
                            Open Full UI <i class="ph-bold ph-arrow-square-out text-lg"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            updatePaginationUI();
        }

        function triggerAction(event, targetName, actionName) {
            if (event) event.stopPropagation();
            showToast(`${targetName}: ${actionName}`);
        }

        function showToast(message) {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = 'bg-gray-800 border border-gray-600 text-gray-200 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 toast-animate text-sm';
            toast.innerHTML = `<i class="ph-fill ph-info text-blue-400 text-xl"></i> <span>${message}</span>`;
            container.appendChild(toast);
            setTimeout(() => { toast.remove(); }, 3000);
        }

        function updatePaginationUI() {
            document.getElementById('btn-prev').classList.toggle('hidden', currentPage === 0);
            document.getElementById('btn-next').classList.toggle('hidden', currentPage === totalPages - 1);
            let dotsHTML = '';
            for (let i = 0; i < totalPages; i++) {
                dotsHTML += `<div class="h-2 rounded-full transition-all duration-300 ${i === currentPage ? 'bg-blue-500 w-6' : 'bg-gray-700 w-2'}"></div>`;
            }
            document.getElementById('pagination-dots').innerHTML = dotsHTML;
        }

        function nextPage() { if (currentPage < totalPages - 1) { currentPage++; renderDashboard(); } }
        function prevPage() { if (currentPage > 0) { currentPage--; renderDashboard(); } }

        window.onload = initApp;
    </script>
</body>
</html>