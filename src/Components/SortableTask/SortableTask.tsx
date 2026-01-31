import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import EditTask from '../EditTask/EditTask';
// استيراد الواجهة التي عرفناها في الـ Slice أو ملف الأنواع
import { Task } from '../../features/TaskSlice'; 

// 1. تعريف واجهة للـ Props الخاصة بالمكون
interface SortableTaskProps {
    task: Task;
    handleDelete: (id: string | number) => void;
}

// 2. استخدام React.FC وتمرير الواجهة لها
const SortableTask: React.FC<SortableTaskProps> = ({ task, handleDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id });

    // 3. تعريف نوع الـ Style كـ React.CSSProperties لضمان دقة الخصائص
    const style: React.CSSProperties = {
        transition,
        transform: CSS.Transform.toString(transform),
        touchAction: 'none',
        // zIndex: isDragging ? 10 : 0,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative', // تحسين بصري عند السحب
    };

    return (
        <li 
            ref={setNodeRef} 
            style={style} 
            className={`p-4 rounded-md shadow-sm flex justify-between items-center transition-colors ${
                isDragging ? 'bg-blue-100' : 'bg-gray-50'
            }`}
        >
            <div {...attributes} {...listeners} className="flex-1 cursor-move">
                
                <h3 className='text-lg font-medium text-gray-800'>{task.title}</h3>
                {task.description && <p className='text-gray-600'>{task.description}</p>}
                <p className='mt-1 text-sm font-semibold'>
                    Status: <span className='italic underline'>{task.status}</span>
                </p>
            </div>
            
            <div className='flex space-x-2'>
                {/* تأكد من تحديث مكون EditTask ليدعم TypeScript أيضاً لاحقاً */}
                <EditTask task={task}/>
                <button 
                    className='px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600' 
                    onClick={() => handleDelete(task.id)}
                >
                    Delete
                </button>
            </div>
        </li>
    );
};

export default SortableTask;