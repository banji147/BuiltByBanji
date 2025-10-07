function updateProgressRing(percentage) {
  const progressBar = document.querySelector(".progress-bar");
  const progressText = document.getElementById("progressText");

  const radius = 65;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (percentage / 100) * circumference;
  progressBar.style.strokeDashoffset = offset;
  progressText.textContent = `${percentage}%`;
}

// Example: set progress to 70%
updateProgressRing(70);
const workoutForm = document.getElementById("workoutForm");
const workoutHistory = document.getElementById("workoutHistory");

let totalReps = 0;
let goalReps = 100; // Example daily target

workoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const exercise = document.getElementById("exercise").value;
  const weight = document.getElementById("weight").value;
  const reps = parseInt(document.getElementById("reps").value);

  // Add to history list
  const li = document.createElement("li");
  li.textContent = `${exercise} - ${weight}kg x ${reps} reps`;
  workoutHistory.appendChild(li);

  // Update total reps
  totalReps += reps;
  let percentage = Math.min(Math.round((totalReps / goalReps) * 100), 100);
  updateProgressRing(percentage);

  // Reset form
  workoutForm.reset();
});

// Progress ring function
function updateProgressRing(percentage) {
  const progressBar = document.querySelector(".progress-bar");
  const progressText = document.getElementById("progressText");

  const radius = 65;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (percentage / 100) * circumference;
  progressBar.style.strokeDashoffset = offset;
  progressText.textContent = `${percentage}%`;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('workoutForm');
  const historyList = document.getElementById('workoutHistory');

  // Helper to create a history li
  function createHistoryItem({ exercise, weight, reps, dateStr }) {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = `
      <div class="history-info">
        <strong>${escapeHtml(exercise)}</strong>
        <div>${escapeHtml(weight)} kg × ${escapeHtml(reps)} reps</div>
        <div class="history-date">${escapeHtml(dateStr)}</div>
      </div>
      <button class="delete-btn" aria-label="Delete entry">&times;</button>
    `;
    return li;
  }

  // Simple escape to avoid accidental HTML injection (good practice)
  function escapeHtml(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Form submit — add entry
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const exercise = document.getElementById('exercise')?.value || '';
      const weight = document.getElementById('weight')?.value || '';
      const reps = document.getElementById('reps')?.value || '';

      if (!exercise || !weight || !reps) {
        alert('Please fill all fields before adding.');
        return;
      }

      const dateStr = new Date().toLocaleString(); // show date+time
      const item = createHistoryItem({ exercise, weight, reps, dateStr });

      // Add to top
      historyList.prepend(item);

      // Optionally animate in (small pop) — quick CSS tweak possible if you want

      // Clear form
      form.reset();
      // Optionally focus first input again:
      document.getElementById('exercise')?.focus();
    });
  }

  // Event delegation for delete buttons — works for items added later
  historyList.addEventListener('click', (e) => {
    const btn = e.target.closest('.delete-btn');
    if (!btn) return;
    const li = btn.closest('li.history-item');
    if (!li) return;

    // Add fade-out class so it animates nicely
    li.classList.add('fade-out');

    // Remove after transition (fallback timeout)
    const rm = () => li.remove();
    // use transitionend if available
    let finished = false;
    li.addEventListener('transitionend', function onEnd(ev) {
      // ensure we only run once
      if (finished) return;
      finished = true;
      li.removeEventListener('transitionend', onEnd);
      rm();
    });

    // fallback: remove after 350ms if transitionend doesn't fire
    setTimeout(() => {
      if (!finished) rm();
    }, 350);
  });

});
// --- Streak Tracker ---
function calculateStreaks() {
  const history = loadHistory();
  if (history.length === 0) {
    document.getElementById("currentStreak").textContent = "0";
    document.getElementById("bestStreak").textContent = "0";
    return;
  }

  // Extract unique workout dates
  const dates = [...new Set(history.map(item => 
    new Date(item.date).toLocaleDateString()
  ))].sort((a, b) => new Date(b) - new Date(a));

  let currentStreak = 1;
  let bestStreak = 1;

  for (let i = 0; i < dates.length - 1; i++) {
    const today = new Date(dates[i]);
    const yesterday = new Date(dates[i + 1]);

    // Difference in days
    const diff = (today - yesterday) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      currentStreak++;
      if (currentStreak > bestStreak) bestStreak = currentStreak;
    } else {
      break; // streak broken
    }
  }

  // Update UI
  document.getElementById("currentStreak").textContent = currentStreak;
  document.getElementById("bestStreak").textContent = bestStreak;
}

// Call after rendering history
renderHistory = (function(originalFn) {
  return function() {
    originalFn();
    calculateStreaks();
  };
})(renderHistory);
function updatePRs() {
  let rows = document.querySelectorAll("#historyTable tbody tr");
  let prs = {};

  rows.forEach(row => {
    let exercise = row.cells[1].innerText;
    let weight = parseFloat(row.cells[3].innerText);
    let reps = parseInt(row.cells[4].innerText);
    let score = weight * reps; // Simple metric

    if (!prs[exercise] || score > prs[exercise].score) {
      prs[exercise] = { weight, reps, score };
    }
  });

  let prList = document.getElementById("prList");
  prList.innerHTML = "";
  for (let [exercise, record] of Object.entries(prs)) {
    let li = document.createElement("li");
    li.textContent = `${exercise}: ${record.weight}kg x ${record.reps} reps`;
    prList.appendChild(li);
  }
}

updatePRs();
