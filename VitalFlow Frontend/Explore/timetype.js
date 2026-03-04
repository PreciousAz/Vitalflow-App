



/* 
document.querySelectorAll('.option').forEach(opt => {
  opt.addEventListener('click', function () {
    document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    this.classList.add('selected');
  });
}); */

const resultDisplay = document.getElementById('selectedResult');
function handleContinue() {
    const selectedDateInput = document.querySelector('#dateOptions input[type="checkbox"]:checked');
    const calendarDate = calendarPicker.value;

    let selectedDate = '';
    if (selectedDateInput) {
        selectedDate = selectedDateInput.value;
    } else if (calendarDate) {
        selectedDate = calendarDate;
    }

    // Get checked time
    const selectedTimeInput = document.querySelector('#timeOptions input[type="checkbox"]:checked');
    const selectedTime = selectedTimeInput ? selectedTimeInput.value : '';

    if (!selectedDate || !selectedTime) {
        alert('Please select both a date and a time slot.');
        return;
    }

    resultDisplay.textContent = `You selected: ${selectedDate} at ${selectedTime}`;
    localStorage.setItem('step4', JSON.stringify({ date: selectedDate, time: selectedTime }));
    window.location.assign('./infopage.html');
}

function handleBack() {
    window.location.assign('./appointtype.html');
}

/* function setupOptionGroup(groupSelector) {
  const container = document.querySelector(groupSelector);
  const options = container.querySelectorAll('.option');

  options.forEach(option => {
    option.addEventListener('click', function (e) {
      // Prevent double toggle when checkbox is clicked
      if (e.target.tagName.toLowerCase() === 'input') return;

      // Clear other selections
      options.forEach(opt => {
        opt.classList.remove('selected');
        opt.querySelector('input').checked = false;
      });

      // Activate current
      this.classList.add('selected');
      this.querySelector('input').checked = true;
    });
  });
} */

// Activate logic for both date and time groups
/* setupOptionGroup('#date-options');
setupOptionGroup('#time-options'); */

// Optional: Prevent calendar date checkbox conflict
/* document.getElementById('customDate').addEventListener('change', function () {
  // Deselect all other date checkboxes
  document.querySelectorAll('#date-options .option:not(.calendar-picker)').forEach(opt => {
    opt.classList.remove('selected');
    opt.querySelector('input[type="checkbox"]').checked = false;
  });
}); */


const dateContainer = document.getElementById('dateOptions');
const timeContainer = document.getElementById('timeOptions');
const calendarPicker = document.getElementById('calendarPicker');

const timeSlots = [
    '8:00am–9:00am',
    '9:00am–11:00am',
    '11:00am–12:00am',
    '12:00pm–2:00pm',
    '2:00am–3:00pm',
    '3:00pm–4:00pm'
];

// Generate next 5 days starting tomorrow
const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 5; i++) {
        const nextDate = new Date();
        nextDate.setDate(today.getDate() + i);
        dates.push({
            label: i === 1 ? `Tomorrow ${nextDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}` :
                nextDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
            value: nextDate.toISOString().split('T')[0]
        });
    }
    return dates;
};

const renderOptions = (container, options, name) => {
    options.forEach((opt, idx) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.innerHTML = `
          <span>${opt.label}</span>
          <input type="checkbox" name="${name}" value="${opt.value}" />
        `;
        div.addEventListener('click', () => {
            const check = div.querySelector('input');
            check.checked = !check.checked;
            div.classList.toggle('selected', check.checked);
        });
        container.appendChild(div);
    });
};

const init = () => {
    const dates = generateDates();
    renderOptions(dateContainer, dates, 'date');

    const timeOpts = timeSlots.map(slot => ({
        label: slot,
        value: slot
    }));
    renderOptions(timeContainer, timeOpts, 'time');

    // Set minimum selectable date in calendar
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    calendarPicker.min = tomorrow.toISOString().split('T')[0];
};

init();


