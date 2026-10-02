// "Report an issue" dialog. Collects a title, description, kind, optional
// email and up to N screenshots, and posts them as multipart/form-data to the
// OrionOps public intake endpoint. On success it shows the link to the task
// so the visitor can watch the agents work on it.
(function () {
  const cfg = window.NEBULA_CONFIG || {};
  const dialog = document.getElementById('report-dialog');
  const openBtn = document.getElementById('report-open');
  if (!dialog || !openBtn) return;

  const form = dialog.querySelector('form');
  const fileInput = dialog.querySelector('#report-files');
  const dropZone = dialog.querySelector('.drop-zone');
  const previews = dialog.querySelector('.previews');
  const status = dialog.querySelector('.report-status');
  const submitBtn = dialog.querySelector('button[type="submit"]');
  const closeBtns = dialog.querySelectorAll('[data-close]');
  const result = dialog.querySelector('.report-result');

  const maxFiles = cfg.maxFiles || 3;
  const maxBytes = (cfg.maxFileMb || 5) * 1024 * 1024;
  const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
  let files = [];

  function setStatus(msg, kind) {
    status.textContent = msg || '';
    status.dataset.kind = kind || '';
  }

  function renderPreviews() {
    previews.innerHTML = '';
    files.forEach((file, i) => {
      const item = document.createElement('div');
      item.className = 'preview';
      const img = document.createElement('img');
      img.alt = file.name;
      img.src = URL.createObjectURL(file);
      img.onload = () => URL.revokeObjectURL(img.src);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'preview-remove';
      remove.setAttribute('aria-label', 'Remove ' + file.name);
      remove.textContent = '×';
      remove.onclick = () => { files.splice(i, 1); renderPreviews(); };
      item.append(img, remove);
      previews.appendChild(item);
    });
    dropZone.hidden = files.length >= maxFiles;
  }

  function addFiles(list) {
    for (const file of list) {
      if (files.length >= maxFiles) { setStatus('Up to ' + maxFiles + ' images.', 'error'); break; }
      if (!allowed.includes(file.type)) { setStatus(file.name + ': only PNG, JPG, WebP or GIF.', 'error'); continue; }
      if (file.size > maxBytes) { setStatus(file.name + ': larger than ' + (cfg.maxFileMb || 5) + ' MB.', 'error'); continue; }
      files.push(file);
    }
    renderPreviews();
  }

  function open() {
    result.hidden = true;
    form.hidden = false;
    form.reset();
    files = [];
    renderPreviews();
    setStatus('');
    form.elements.page_url.value = location.href;
    dialog.showModal();
    form.elements.title.focus();
  }

  function close() { dialog.close(); }

  openBtn.addEventListener('click', open);
  closeBtns.forEach((b) => b.addEventListener('click', close));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });

  fileInput.addEventListener('change', () => { addFiles(fileInput.files); fileInput.value = ''; });
  ['dragenter', 'dragover'].forEach((ev) => dropZone.addEventListener(ev, (e) => { e.preventDefault(); dropZone.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach((ev) => dropZone.addEventListener(ev, (e) => { e.preventDefault(); dropZone.classList.remove('is-over'); }));
  dropZone.addEventListener('drop', (e) => addFiles(e.dataTransfer.files));

  // Paste a screenshot straight from the clipboard.
  dialog.addEventListener('paste', (e) => {
    const items = Array.from(e.clipboardData?.items || []).filter((i) => i.kind === 'file');
    if (items.length) addFiles(items.map((i) => i.getAsFile()));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!cfg.intakeUrl) { setStatus('Reporting is not configured on this site.', 'error'); return; }

    const data = new FormData(form);
    files.forEach((f) => data.append('files', f, f.name));

    submitBtn.disabled = true;
    setStatus('Sending…');
    try {
      const res = await fetch(cfg.intakeUrl, { method: 'POST', body: data });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus(body.message || 'Could not send the report (' + res.status + ').', 'error');
        return;
      }
      form.hidden = true;
      result.hidden = false;
      result.querySelector('.result-title').textContent = body.title || data.get('title');
      const link = result.querySelector('a');
      if (body.board_url) { link.href = body.board_url; link.hidden = false; } else { link.hidden = true; }
    } catch (err) {
      setStatus('Network error. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
