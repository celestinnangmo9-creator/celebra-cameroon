/* ==========================================================================
   Celebra Cameroon - Interactive Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle Initializer
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const currentTheme = localStorage.getItem('celebra-theme') || 'light';
  
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      if (activeTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('celebra-theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('celebra-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      }
    });
  }

  // 2. Booking Calculator
  const startDateInput = document.getElementById('calc-start-date');
  const endDateInput = document.getElementById('calc-end-date');
  const daysOutput = document.getElementById('calc-days-count');
  const totalOutput = document.getElementById('calc-total-price');

  function calculateBookingPrice() {
    if (!startDateInput || !endDateInput || !totalOutput) return;
    const pricePerDay = parseFloat(startDateInput.dataset.priceDay || 0);
    
    if (startDateInput.value && endDateInput.value) {
      const start = new Date(startDateInput.value);
      const end = new Date(endDateInput.value);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays > 0) {
        if (daysOutput) daysOutput.textContent = `${diffDays} jour(s)`;
        const total = diffDays * pricePerDay;
        totalOutput.textContent = new Intl.NumberFormat('fr-FR').format(total) + ' FCFA';
      }
    }
  }

  if (startDateInput && endDateInput) {
    startDateInput.addEventListener('change', calculateBookingPrice);
    endDateInput.addEventListener('change', calculateBookingPrice);
  }

  // 3. Audio / Video Call Simulation Modal
  const callModal = document.getElementById('call-modal-overlay');
  const callTitle = document.getElementById('call-modal-title');
  const callStatus = document.getElementById('call-modal-status');
  const endCallBtn = document.getElementById('end-call-btn');
  let callTimerInterval = null;

  window.startSimulatedCall = function(name, type) {
    if (!callModal) return;
    callModal.classList.add('active');
    callTitle.textContent = `${type === 'video' ? '📹 Appel Vidéo' : '📞 Appel Audio'} - ${name}`;
    callStatus.textContent = 'Sonnerie en cours...';

    let seconds = 0;
    setTimeout(() => {
      callStatus.textContent = 'En communication (00:00)';
      callTimerInterval = setInterval(() => {
        seconds++;
        const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        callStatus.textContent = `En communication (${mins}:${secs})`;
      }, 1000);
    }, 2500);
  };

  if (endCallBtn) {
    endCallBtn.addEventListener('click', () => {
      if (callModal) callModal.classList.remove('active');
      if (callTimerInterval) clearInterval(callTimerInterval);
      callStatus.textContent = 'Appel terminé';
    });
  }
});
