import { configureStore } from "@reduxjs/toolkit";
import TaskSlice from "./TaskSlice";

export const store = configureStore({
    reducer: {
        tasks: TaskSlice
    }
});

// 1. استخراج نوع الحالة الكاملة (RootState)
// هذا سيخبر useSelector بكل البيانات الموجودة في المتجر
export type RootState = ReturnType<typeof store.getState>;

// 2. استخراج نوع الـ Dispatch
// هذا سيساعدك عند استخدام الـ Thunks (مثل جلب البيانات من API)
export type AppDispatch = typeof store.dispatch;