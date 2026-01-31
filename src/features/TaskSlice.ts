import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { arrayMove } from '@dnd-kit/sortable';

// 1. تعريف شكل المهمة الواحدة
export interface Task {
    id: number | string;
    title: string;
    description: string;
    status: "To Do" | "Completed" | string;
}

// 2. تعريف شكل الحالة في Redux
interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    status: string;
}

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
    status: "All"
};

// 3. تعديل الـ AsyncThunk (تحديد نوع البيانات المرجعة)
export const fetchTodo = createAsyncThunk<Task[]>('tasks/fetchTodo', async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
    const data = await response.json();
    
    // تأكد من مطابقة البيانات القادمة من API لشكل Task لدينا
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
        // استخدام PayloadAction لتحديد نوع البيانات القادمة في الـ Dispatch
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload);
        },
        editTask: (state, action: PayloadAction<Task>) => {
            state.tasks = state.tasks.map(task =>
                task.id === action.payload.id ? action.payload : task
            );
        },
        deleteTask: (state, action: PayloadAction<number | string>) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
        },
        reorderTasks: (state, action: PayloadAction<{ activeId: string | number; overId: string | number }>) => {
            const { activeId, overId } = action.payload;
            const oldIndex = state.tasks.findIndex((t) => t.id === activeId);
            const newIndex = state.tasks.findIndex((t) => t.id === overId);
            
            if (oldIndex !== -1 && newIndex !== -1) {
                state.tasks = arrayMove(state.tasks, oldIndex, newIndex);
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
                state.tasks = action.payload;
            })
            .addCase(fetchTodo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Something went wrong";
            });
    }
});

export const { addTask, editTask, deleteTask, reorderTasks } = taskSlice.actions;
export default taskSlice.reducer;