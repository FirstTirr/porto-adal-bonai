const fs = require('fs');

let content = fs.readFileSync('src/pages/admin.astro', 'utf-8');

const searchJS = `async function saveSettingsForm(formEvent: Event, formElement: HTMLFormElement) {
  formEvent.preventDefault();
  const statusEl = formElement.querySelector('.settings-status');
  if (statusEl) statusEl.textContent = 'Saving...';
  
  const formData = new FormData(formElement);
  const data: Record<string, string> = {};
  formData.forEach((val, key) => { data[key] = String(val); });`;

const replaceJS = `async function saveSettingsForm(formEvent: Event, formElement: HTMLFormElement) {
  formEvent.preventDefault();
  const statusEl = formElement.querySelector('.settings-status');
  if (statusEl) statusEl.textContent = 'Menyimpan...';

  const formData = new FormData(formElement);
  const data: Record<string, string> = {};

  // Upload Home Image
  if (formData.has('home_img')) {
      const file = formData.get('home_img') as File;
      if (file && file.size > 0) {
          if (statusEl) statusEl.textContent = 'Mengunggah gambar...';
          const uploadData = new FormData();
          uploadData.append('file', file);
          try {
              const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
              if (res.ok) {
                  const body = await res.json();
                  data['home_img'] = body.url;
              }
          } catch(e) {}
      } else if (formData.has('home_img_url')) {
          data['home_img'] = formData.get('home_img_url') as string;
      }
  }

  // Upload About Image
  if (formData.has('about_img')) {
      const file = formData.get('about_img') as File;
      if (file && file.size > 0) {
          if (statusEl) statusEl.textContent = 'Mengunggah gambar...';
          const uploadData = new FormData();
          uploadData.append('file', file);
          try {
              const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
              if (res.ok) {
                  const body = await res.json();
                  data['about_img'] = body.url;
              }
          } catch(e) {}
      } else if (formData.has('about_img_url')) {
          data['about_img'] = formData.get('about_img_url') as string;
      }
  }

  // Gather the rest
  formData.forEach((val, key) => { 
      if (!['home_img', 'about_img', 'home_img_url', 'about_img_url'].includes(key)) {
          data[key] = String(val); 
      }
  });`;

content = content.replace(searchJS, replaceJS);
fs.writeFileSync('src/pages/admin.astro', content);
