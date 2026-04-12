const fs = require('fs');
let content = fs.readFileSync('src/pages/admin.astro', 'utf-8');

content = content.replace(
  '  social_tiktok: "https://tiktok.com/"\n};',
  '  social_tiktok: "https://tiktok.com/",\n  social_linkedin: "https://linkedin.com/in/",\n  social_facebook: "https://facebook.com/",\n  social_x: "https://x.com/"\n};'
);

const newInputs = `                <div>
                  <label class="text-sm font-semibold text-slate-700 mb-2 block">TikTok URL</label>
                  <div class="relative">
                    <input name="social_tiktok" value={getSetting("social_tiktok")} placeholder="https://tiktok.com/@..." class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium text-slate-700" />
                  </div>
                </div>
                <div>
                  <label class="text-sm font-semibold text-slate-700 mb-2 block">LinkedIn URL</label>
                  <div class="relative">
                    <input name="social_linkedin" value={getSetting("social_linkedin")} placeholder="https://linkedin.com/in/..." class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium text-slate-700" />
                  </div>
                </div>
                <div>
                  <label class="text-sm font-semibold text-slate-700 mb-2 block">Facebook URL</label>
                  <div class="relative">
                    <input name="social_facebook" value={getSetting("social_facebook")} placeholder="https://facebook.com/..." class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium text-slate-700" />
                  </div>
                </div>
                <div>
                  <label class="text-sm font-semibold text-slate-700 mb-2 block">X (Twitter) URL</label>
                  <div class="relative">
                    <input name="social_x" value={getSetting("social_x")} placeholder="https://x.com/..." class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium text-slate-700" />
                  </div>
                </div>`;

const inputRegex = /                <div>\s*<label class="text-sm font-semibold text-slate-700 mb-2 block">TikTok URL<\/label>\s*<div class="relative">\s*<input name="social_tiktok"[^>]*>\s*<\/div>\s*<\/div>/m;
content = content.replace(inputRegex, newInputs);

fs.writeFileSync('src/pages/admin.astro', content);
