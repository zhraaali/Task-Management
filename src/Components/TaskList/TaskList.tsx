import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../features/hooks';
import { deleteTask, fetchTodo, reorderTasks } from '../../features/TaskSlice';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableTask from '../SortableTask/SortableTask';
import { 
  DndContext, 
  TouchSensor, 
  KeyboardSensor, 
  PointerSensor, 
  closestCenter, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from '@dnd-kit/core';

// 1. تعريف واجهة الـ Props (هذا ما يحل خطأ App.tsx)
interface TaskListProps {
    searchTerm: string;
    filterStatus: string;
}

// 2. تمرير الواجهة للمكون واستخراج القيم منها
const TaskList: React.FC<TaskListProps> = ({ searchTerm, filterStatus }) => {
    const tasks = useAppSelector((state) => state.tasks.tasks);
    const loading = useAppSelector((state) => state.tasks.loading);
    const error = useAppSelector((state) => state.tasks.error);
    const dispatch = useAppDispatch();

    // 3. تطبيق منطق الفلترة والبحث
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        dispatch(fetchTodo());
    }, [dispatch]);

    const handleDelete = (id: string | number) => {
        dispatch(deleteTask(id));
    };

    if (loading) return <p className="text-center p-5 text-indigo-500 font-semibold">Tasks Loading ...</p>;
    if (error) return <p className="text-center p-5 text-red-500">There is an error {error}</p>;

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
    
        if (over && active.id !== over.id) {
            dispatch(reorderTasks({
                activeId: active.id,
                overId: over.id
            }));
        }
    };

    return (
        <DndContext 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <div className="mt-4">
                <h2 className="text-xl font-bold mb-4 text-gray-700">Tasks ({filteredTasks.length})</h2>
                <ul className='space-y-4'>
                    {/* 4. ملاحظة: نستخدم filteredTasks هنا بدلاً من tasks */}
                    <SortableContext 
                        items={filteredTasks.map(t => t.id)} 
                        strategy={verticalListSortingStrategy}
                    >
                        {filteredTasks.map(task => (
                            <SortableTask 
                                key={task.id} 
                                task={task} 
                                handleDelete={handleDelete} 
                            />
                        ))}
                    </SortableContext>
                </ul>

                {/* عرض رسالة في حال عدم وجود نتائج */}
                {filteredTasks.length === 0 && (
                    <div className="text-center py-10 text-gray-400 italic">
                        No tasks match your criteria...
                    </div>
                )}
            </div>
        </DndContext>
    );
}

export default TaskList;