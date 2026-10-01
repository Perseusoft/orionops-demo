// Small progressive enhancements. Keep this file dependency-free.
document.getElementById('year').textContent = new Date().getFullYear();

const form = document.querySelector('.cta-form');
const note = document.getElementById('form-note');
if (form && note) {
  form.addEventListener('submit', () => {
    note.hidden = false;
    form.reset();
  });
}
