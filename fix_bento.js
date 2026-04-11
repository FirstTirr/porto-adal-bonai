const fs = require('fs');
let content = fs.readFileSync('src/pages/index.astro', 'utf-8');

const search = `{projects.slice(0, 5).map((project, index) => {
              let spanClass = "col-span-1 row-span-1";
              let titleSize = "text-xl md:text-2xl lg:text-3xl";
              if (index === 0) { spanClass = "md:col-span-2 md:row-span-2"; titleSize = "text-3xl md:text-5xl"; }
              else if (index === 1 || index === 2) { spanClass = "md:col-span-2 md:row-span-1"; titleSize = "text-2xl md:text-3xl"; }
              
              return (`;

const replace = `{projects.slice(0, 5).map((project, index, arr) => {
              let spanClass = "col-span-1 row-span-1";
              let titleSize = "text-xl md:text-2xl lg:text-3xl";
              
              const totalItems = arr.length;
              if (totalItems >= 5) {
                if (index === 0) { spanClass = "md:col-span-2 md:row-span-2"; titleSize = "text-3xl md:text-5xl"; }
              } else if (totalItems === 4) {
                if (index === 0) { spanClass = "md:col-span-2 md:row-span-2"; titleSize = "text-3xl md:text-5xl"; }
                else if (index === 1) { spanClass = "md:col-span-2 md:row-span-1"; titleSize = "text-2xl md:text-3xl"; }
              } else if (totalItems === 3) {
                if (index === 0) { spanClass = "md:col-span-2 md:row-span-2"; titleSize = "text-3xl md:text-5xl"; }
                else if (index === 1 || index === 2) { spanClass = "md:col-span-2 md:row-span-1"; titleSize = "text-2xl md:text-3xl"; }
              } else if (totalItems === 2) {
                spanClass = "md:col-span-2 md:row-span-2"; titleSize = "text-3xl md:text-5xl";
              } else {
                spanClass = "md:col-span-4 md:row-span-2"; titleSize = "text-4xl md:text-6xl";
              }
              
              return (`;

if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync('src/pages/index.astro', content);
    console.log("Success");
} else {
    // try line per line regex if exact string literal failed
    console.log("Could not find search string.");
}
