const fs = require('fs');

let content = fs.readFileSync('src/pages/admin.astro', 'utf-8');

// Replace standard input for hero image with file upload input
content = content.replace(
    '<input name="home_img" value={getSetting("home_img")} class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none" />',
    \`<input name="home_img" type="file" accept="image/*" class="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-teal-50 file:text-teal-700 cursor-pointer" />
                  <input name="home_img_url" type="hidden" value={getSetting("home_img")} />
                  <p class="text-xs text-slate-500 mt-1">Kosongkan jika tidak ingin mengubah gambar hero yang ada.</p>\`
);

// Replace standard input for about image with file upload input
content = content.replace(
    '<input name="about_img" value={getSetting("about_img")} class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none" />',
    \`<input name="about_img" type="file" accept="image/*" class="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-50 file:text-emerald-700 cursor-pointer" />
                  <input name="about_img_url" type="hidden" value={getSetting("about_img")} />
                  <p class="text-xs text-slate-500 mt-1">Kosongkan jika tidak ingin mengubah gambar profil yang ada.</p>\`
);

// Replace JS logic for settings form submission
const searchJS = \`async function saveSettingsForm(formEvent: Event, formElement: HTMLFormElement) \{
  formEvent.preventDefault();
  const statusEl = formElement.querySelector('.settings-status');
  if (statusEl) statusEl.textContent = 'Saving...';
  
  const formData = new FormData(formElement);
  const data: Record<string, string> = \{\};
  formData.forEach((val, key) => \{ data[key] = String(val); \});

  try \{
    const res = await fetch('/api/settings', \{
      method: 'POST',
      headers: \{ 'Content-Type': 'application/json' \},
      body: JSON.stringify(data)
    \});\`;

const replaceJS = \`async function saveSettingsForm(formEvent: Event, formElement: HTMLFormElement) \{
  formEvent.preventDefault();
  const statusEl = formElement.querySelector('.settings-status');
  if (statusEl) statusEl.textContent = 'Menyimpan...';
  
  const formData = new FormData(formElement);
  const data: Record<string, string> = \{\};
  
  // Handle Home Img Upload
  if (formData.has('home_img')) \{
     const file = formData.get('home_img') as File;
     if (file && file.size > 0) \{
        statusEl!.textContent = 'Mengunggah gambar hero...';
        const uploadData = new FormData();
        uploadData.append('file', file);
        const res = await fetch('/api/upload', \{ method: 'POST', body: uploadData \});
        if (res.ok) \{
           const body = await res.json();
           data['home_img'] = body.url;
        \}
     \} else if (formData.has('home_img_url')) \{
         data['home_img'] = formData.get('home_img_url') as string;
     \}
  \}
  
  // Handle About Img Upload
  if (formData.has('about_img')) \{
     const file = formData.get('about_img') as File;
     if (file && file.size > 0) \{
        statusEl!.textContent = 'Mengunggah gambar about...';
        const uploadData = new FormData();
        uploadData.append('file', file);
        const res = await fetch('/api/upload', \{ method: 'POST', body: uploadData \});
        if (res.ok) \{
           const body = await res.json();
           data['about_img'] = body.url;
        \}
     \} else if (formData.has('about_img_url')) \{
         data['about_img'] = formData.get('about_img_url') as string;
     \}
  \}

  formData.forEach((val, key) => \{ 
      if (key !== 'home_img' && key !== 'about_img' && key !== 'home_img_url' && key !== 'about_img_url') \{
          data[key] = String(val); 
      \}
  \});

  try \{
    const res = await fetch('/api/settings', \{
      method: 'POST',
      headers: \{ 'Content-Type': 'application/json' \},
      body: JSON.stringify(data)
    \});\`;

content = content.replace(searchJS, replaceJS);

fs.writeFileSync('src/pages/admin.astro', content);
console.log("Success modifying admin.astro");
