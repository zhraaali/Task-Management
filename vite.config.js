// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [react(),
//     tailwindcss(),],
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// لم نعد نحتاج إلى استيراد tailwindcss هنا!

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // تمت إزالة tailwindcss() هنا. سيعمل Tailwind الآن عبر PostCSS.
  ],
})