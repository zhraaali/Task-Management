import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { arrayMove } from '@dnd-kit/sortable';

export interface Task {
    id: number | string;
    title: string;
    description: string;
    status: "To Do" | "Completed" | string;
}

interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    status: string;
}

// 1. دالة مساعدة لجلب البيانات من التخزين المحلي عند تشغيل التطبيق
const loadTasksFromLocalStorage = (): Task[] => {
    try {
        const savedTasks = localStorage.getItem('my_tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (e) {
        return [];
    }
};

// 2. دالة مساعدة لحفظ البيانات (سنستدعيها داخل كل Reducer)
const saveToLocalStorage = (tasks: Task[]) => {
    localStorage.setItem('my_tasks', JSON.stringify(tasks));
};

const initialState: TaskState = {
    tasks: loadTasksFromLocalStorage(), // يبدأ التطبيق بالبيانات المحفوظة
    loading: false,
    error: null,
    status: "All"
};

export const fetchTodo = createAsyncThunk<Task[]>('tasks/fetchTodo', async () => {
    // جلب البيانات فقط إذا كان التخزين المحلي فارغاً (اختياري - لتعزيز تجربة المستخدم)
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
    const data = await response.json();
    
    return data.map((task: any): Task => ({
        id: task.id,
        title: task.title,
        description: '',
        status: task.completed ? "Completed" : "To Do"
    }));
});

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload);
            saveToLocalStorage(state.tasks); // حفظ التغيير
        },
        editTask: (state, action: PayloadAction<Task>) => {
            state.tasks = state.tasks.map(task =>
                task.id === action.payload.id ? action.payload : task
            );
            saveToLocalStorage(state.tasks); // حفظ التغيير
        },
        deleteTask: (state, action: PayloadAction<number | string>) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
            saveToLocalStorage(state.tasks); // حفظ التغيير
        },
        reorderTasks: (state, action: PayloadAction<{ activeId: string | number; overId: string | number }>) => {
            const { activeId, overId } = action.payload;
            const oldIndex = state.tasks.findIndex((t) => t.id === activeId);
            const newIndex = state.tasks.findIndex((t) => t.id === overId);
            
            if (oldIndex !== -1 && newIndex !== -1) {
                state.tasks = arrayMove(state.tasks, oldIndex, newIndex);
                saveToLocalStorage(state.tasks); // حفظ الترتيب الجديد
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTodo.fulfilled, (state, action: PayloadAction<Task[]>) => {
                state.loading = false;
                // إذا كان التخزين المحلي فارغاً فقط، نملؤه ببيانات الـ API
                if (state.tasks.length === 0) {
                    state.tasks = action.payload;
                    saveToLocalStorage(state.tasks);
                }
            })
            .addCase(fetchTodo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Something went wrong";
            });
    }
});

export const { addTask, editTask, deleteTask, reorderTasks } = taskSlice.actions;
export default taskSlice.reducer;