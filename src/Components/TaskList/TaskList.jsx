





import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteTask, fetchTodo,reorderTasks } from '../../features/TaskSlice'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableTask from '../SortableTask/SortableTask'; // استيراد المكون الجديد
import { DndContext,TouchSensor, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';

const TaskList = () => {
    const tasks = useSelector((state) => state.tasks.tasks)
    const loading = useSelector((state) => state.tasks.loading)
    const error = useSelector((state) => state.tasks.error)
    const dispatch = useDispatch()
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // يبدأ السحب بعد تحريك الماوس 5 بكسل (لمنع السحب بالخطأ عند الضغط)
            },
        }),
        useSensor(TouchSensor, {
            // هذه الخاصية ضرورية جداً للموبايل
            // تمنع السحب من التداخل مع التمرير الطبيعي للشاشة
            activationConstraint: {
                delay: 250, // اضغط لمدة ربع ثانية ليبدأ السحب
                tolerance: 5, // مقدار الخطأ المسموح به في حركة الإصبع قبل الإلغاء
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        dispatch(fetchTodo())
    }, [dispatch])

    const handleDelete = (id) => {
        dispatch(deleteTask(id))
    }

    if (loading) return <p>Tasks Loading ...</p>
    if (error) return <p>There is an error {error}</p>

    const handleDragEnd = (event) => {
        const { active, over } = event;
    
        // إذا تم إفلات العنصر فوق عنصر آخر مختلف عنه
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
        <div>
            <h2>Tasks</h2>
            <ul className='space-y-4'>
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <SortableTask 
                            key={task.id} 
                            task={task} 
                            handleDelete={handleDelete} 
                        />
                    ))}
                </SortableContext>
            </ul>
        </div>
        </DndContext>
    )
}

export default TaskList