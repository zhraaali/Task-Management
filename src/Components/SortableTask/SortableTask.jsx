import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import EditTask from '../EditTask/EditTask';

const SortableTask = ({ task, handleDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        // إضافة تنسيق بسيط عند السحب (اختياري)
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <li 
            ref={setNodeRef} 
            style={style} 
            className='bg-gray-50 p-4 rounded-md shadow-sm flex justify-between items-center'
        >
            <div {...attributes} {...listeners} className="flex-1 cursor-move">
                <h3 className='text-lg font-medium text-gray-800'>{task.title}</h3>
                {task.description && <p className='text-gray-600'>{task.description}</p>}
                <p className='mt-1 text-sm font-semibold'>
                    Status: <span className='italic underline'>{task.status}</span>
                </p>
            </div>
            
            <div className='flex space-x-2'>
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