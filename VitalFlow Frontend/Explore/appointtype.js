


document.querySelectorAll('.option').forEach(opt => {
  opt.addEventListener('click', function () {
    document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    this.classList.add('selected');
  });
});

function handleContinue() {
  const selected = document.querySelector('.option.selected');
  if (!selected) {
    alert("Please select a appointment type.");
    return;
  }
  const selectedText = selected.innerText.split('\n')[0];
  localStorage.setItem('step3', selectedText);
  window.location.assign('./timetype.html');
}

function handleBack() {
  window.location.assign('./details.html');
}