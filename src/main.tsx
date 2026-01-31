// قم بتغيير اسم هذا الملف إلى main.tsx أو index.tsx
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App' // حذف الـ .jsx هنا لأن TypeScript سيتعرف عليه تلقائياً
import { Provider } from 'react-redux'
import { store } from './features/Store'

// إضافة علامة التعجب (!) بعد getElementById لإخبار TS أن العنصر موجود بالتأكيد
const rootElement = document.getElementById('root')!; 

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
