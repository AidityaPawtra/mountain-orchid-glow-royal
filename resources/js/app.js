import '../css/app.css';

// ─────────────────────────────────────────────────────────
// SIDEBAR TOGGLE (Mobile drawer)
// ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    function openMobileSidebar() {
        sidebar?.classList.remove('-translate-x-full');
        sidebarOverlay?.classList.remove('hidden');
    }
    function closeMobileSidebar() {
        sidebar?.classList.add('-translate-x-full');
        sidebarOverlay?.classList.add('hidden');
    }

    document.getElementById('sidebar-open-btn')?.addEventListener('click', openMobileSidebar);
    document.getElementById('sidebar-close-btn')?.addEventListener('click', closeMobileSidebar);
    sidebarOverlay?.addEventListener('click', closeMobileSidebar);

    // ─────────────────────────────────────────────────────────
    // MODAL SYSTEM
    // ─────────────────────────────────────────────────────────
    window.openModal = function (id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        setTimeout(() => modal.querySelector('input, select, textarea')?.focus(), 50);
    };

    window.closeModal = function (id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
        modal.querySelectorAll('form').forEach(f => f.reset());
        // Reset action url back
        modal.querySelectorAll('form[data-base-action]').forEach(f => {
            f.action = f.dataset.baseAction;
        });
        // Reset hidden _method to POST
        modal.querySelectorAll('input[name="_method"]').forEach(i => i.value = 'POST');
    };

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal:not(.hidden)').forEach(m => closeModal(m.id));
        }
    });

    // Close on backdrop click
    document.addEventListener('click', (e) => {
        if (e.target.matches('.modal-backdrop')) {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal.id);
        }
    });

    // ─────────────────────────────────────────────────────────
    // DATA-MODAL OPEN BUTTONS
    // ─────────────────────────────────────────────────────────
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-modal]');
        if (btn && !btn.closest('.modal')) {
            openModal(btn.dataset.modal);
        }
        const closeBtn = e.target.closest('[data-close-modal]');
        if (closeBtn) closeModal(closeBtn.dataset.closeModal);
    });

    // ─────────────────────────────────────────────────────────
    // EDIT BUTTONS → Populate modal form fields
    // ─────────────────────────────────────────────────────────
    document.addEventListener('click', (e) => {
        const editBtn = e.target.closest('[data-edit]');
        if (!editBtn) return;
        const modalId = editBtn.dataset.modal;
        const data = JSON.parse(editBtn.dataset.edit || '{}');
        const modal = document.getElementById(modalId);
        if (!modal) return;

        Object.entries(data).forEach(([key, value]) => {
            const el = modal.querySelector(`[name="${key}"]`);
            if (!el) return;
            if (el.tagName === 'SELECT') {
                el.value = value ?? '';
            } else if (el.type === 'checkbox') {
                el.checked = !!value;
            } else {
                el.value = value ?? '';
            }
        });

        // Switch form to PUT
        const form = modal.querySelector('form');
        if (form && editBtn.dataset.action) {
            form.action = editBtn.dataset.action;
            const method = modal.querySelector('input[name="_method"]');
            if (method) method.value = 'PUT';
        }

        openModal(modalId);
    });

    // ─────────────────────────────────────────────────────────
    // RETURN LOAN BUTTON
    // ─────────────────────────────────────────────────────────
    document.addEventListener('click', (e) => {
        const returnBtn = e.target.closest('[data-return-action]');
        if (!returnBtn) return;
        if (!confirm('Konfirmasi pengembalian barang ini?')) return;
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = returnBtn.dataset.returnAction;
        form.innerHTML = `
            <input type="hidden" name="_token" value="${document.querySelector('meta[name="csrf-token"]').content}">
            <input type="hidden" name="_method" value="POST">
        `;
        document.body.appendChild(form);
        form.submit();
    });

    // ─────────────────────────────────────────────────────────
    // DELETE CONFIRMATION
    // ─────────────────────────────────────────────────────────
    document.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('[data-confirm-delete]');
        if (!deleteBtn) return;
        const message = deleteBtn.dataset.confirmDelete || 'Yakin ingin menghapus data ini?';
        if (!confirm(message)) return;
        const formId = deleteBtn.dataset.form;
        if (formId) {
            document.getElementById(formId)?.submit();
        }
    });

    // ─────────────────────────────────────────────────────────
    // FLASH MESSAGE AUTO-DISMISS
    // ─────────────────────────────────────────────────────────
    document.querySelectorAll('[data-flash]').forEach(el => {
        setTimeout(() => {
            el.style.transition = 'opacity 0.3s, transform 0.3s';
            el.style.opacity = '0';
            el.style.transform = 'translateY(-10px)';
            setTimeout(() => el.remove(), 350);
        }, 3500);
    });

    // ─────────────────────────────────────────────────────────
    // DROPDOWN MENUS
    // ─────────────────────────────────────────────────────────
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-dropdown-toggle]');
        if (trigger) {
            const id = trigger.dataset.dropdownToggle;
            const menu = document.getElementById(id);
            if (!menu) return;
            const isHidden = menu.classList.contains('hidden');
            document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.add('hidden'));
            if (isHidden) menu.classList.remove('hidden');
            return;
        }
        if (!e.target.closest('.dropdown-menu') && !e.target.closest('[data-dropdown-toggle]')) {
            document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.add('hidden'));
        }
    });

    // ─────────────────────────────────────────────────────────
    // TABS
    // ─────────────────────────────────────────────────────────
    document.querySelectorAll('[data-tab-btn]').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.dataset.tabGroup;
            const target = btn.dataset.tabBtn;

            document.querySelectorAll(`[data-tab-group="${group}"]`).forEach(b => {
                b.classList.remove('tab-active');
                b.classList.add('tab-inactive');
            });
            document.querySelectorAll(`[data-tab-panel-group="${group}"]`).forEach(p => {
                p.classList.add('hidden');
            });

            btn.classList.add('tab-active');
            btn.classList.remove('tab-inactive');
            document.getElementById(target)?.classList.remove('hidden');
        });
    });

    // ─────────────────────────────────────────────────────────
    // SEARCH TABLE (client-side)
    // ─────────────────────────────────────────────────────────
    document.querySelectorAll('[data-search-table]').forEach(input => {
        const tableId = input.dataset.searchTable;
        const table = document.getElementById(tableId);
        if (!table) return;
        input.addEventListener('input', () => {
            const q = input.value.toLowerCase();
            table.querySelectorAll('tbody tr').forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
            });
        });
    });

    // ─────────────────────────────────────────────────────────
    // SIDEBAR NAV ACTIVE STATE
    // ─────────────────────────────────────────────────────────
    const currentPath = window.location.pathname;
    document.querySelectorAll('[data-nav-link]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        if (currentPath === href || (href.length > 1 && currentPath.startsWith(href))) {
            link.classList.add('bg-primary', 'text-primary-foreground');
            link.classList.remove('text-sidebar-muted', 'hover:bg-sidebar-hover');
            // Expand parent accordion
            const accordion = link.closest('[data-nav-accordion]');
            accordion?.querySelector('[data-nav-accordion-body]')?.classList.remove('hidden');
        }
    });

    // Nav accordion toggle
    document.querySelectorAll('[data-nav-accordion-toggle]').forEach(btn => {
        btn.addEventListener('click', () => {
            const body = btn.closest('[data-nav-accordion]')?.querySelector('[data-nav-accordion-body]');
            body?.classList.toggle('hidden');
            btn.querySelector('[data-chevron]')?.classList.toggle('-rotate-90');
        });
    });

    // ─────────────────────────────────────────────────────────
    // PAYMENT MODAL: populate savings_loan_id
    // ─────────────────────────────────────────────────────────
    document.addEventListener('click', (e) => {
        const payBtn = e.target.closest('[data-payment-action]');
        if (!payBtn) return;
        const modalId = payBtn.dataset.modal;
        const action = payBtn.dataset.paymentAction;
        const modal = document.getElementById(modalId);
        if (!modal) return;
        const form = modal.querySelector('form');
        if (form) form.action = action;
        openModal(modalId);
    });
});
