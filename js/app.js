/**
 * EduFlow - Core Application Orchestrator & Global State Lifecycle
 * @namespace EduFlowApp
 */

const EduFlowApp = (() => {
    'use strict';

    // Global State Configuration Vector
    const state = {
        theme: 'light',
        initializedModules: new Set(),
        userSession: null
    };

    /**
     * Active Theme Management Engine
     * Syncs document node trees with cached theme variables
     */
    const initThemeEngine = () => {
        const cachedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (cachedTheme === 'dark' || (!cachedTheme && systemPrefersDark)) {
            state.theme = 'dark';
            document.documentElement.classList.add('dark');
        } else {
            state.theme = 'light';
            document.documentElement.classList.remove('dark');
        }
    };

    /**
     * Intercept global system theme change requests
     */
    const toggleGlobalTheme = () => {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        if (state.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', state.theme);
        
        // Dispatch custom global event for active sub-charts to re-render layout colors
        window.dispatchEvent(new CustomEvent('eduflowThemeChanged', { detail: { theme: state.theme } }));
    };

    /**
     * Centralized Toast Notification Dispatch Pipeline
     * @param {string} message - Content notification context payload
     * @param {'success'|'error'|'info'|'warning'} type - Visual contextual classification
     */
    const dispatchToastNotification = (message, type = 'info') => {
        // Attempt tracking dynamically assigned viewport container targets across application windows
        let container = document.getElementById('dashboardToastContainer') || 
                        document.getElementById('profileToastContainer') || 
                        document.getElementById('toastContainer');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `p-4 rounded-xl shadow-xl flex items-start gap-3 border text-xs font-medium transition duration-300 transform translate-y-2 opacity-0 bg-white dark:bg-slate-900`;
        
        let iconHtml = '<i class="fa-solid fa-circle-info text-blue-500"></i>';
        if (type === 'success') {
            toast.classList.add('border-emerald-500/30');
            iconHtml = '<i class="fa-solid fa-circle-check text-emerald-500 text-base"></i>';
        } else if (type === 'error') {
            toast.classList.add('border-rose-500/30');
            iconHtml = '<i class="fa-solid fa-circle-exclamation text-rose-500 text-base"></i>';
        } else if (type === 'warning') {
            toast.classList.add('border-amber-500/30');
            iconHtml = '<i class="fa-solid fa-triangle-exclamation text-amber-500 text-base"></i>';
        } else {
            toast.classList.add('border-slate-200', 'dark:border-slate-800');
        }

        toast.innerHTML = `
            ${iconHtml}
            <div class="flex-1">
                <p class="text-slate-800 dark:text-slate-200">${message}</p>
            </div>
        `;

        container.appendChild(toast);
        
        // Force evaluation reflow to register entry metrics animations
        setTimeout(() => toast.classList.remove('translate-y-2', 'opacity-0'), 10);

        // Auto collapse transaction lifecycle frame configurations
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-[-10px]');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    /**
     * Standard Interface Initialization Core Bootstrap Hook
     */
    const bootstrapApplication = () => {
        initThemeEngine();
        
        // Bind to standard runtime window objects for cross-file linkage orchestration proxying
        window.dispatchSystemToast = dispatchToastNotification;
        window.toggleSystemTheme = toggleGlobalTheme;
        
        console.log("EduFlow Platform Pipeline Core Framework Engine Instantiated Successfully. [System Context: 2026]");
    };

    // Attach immediate initialization hooks
    document.addEventListener('DOMContentLoaded', bootstrapApplication);

    return {
        toggleTheme: toggleGlobalTheme,
        showNotification: dispatchToastNotification,
        getAppState: () => ({ ...state })
    };
})();
