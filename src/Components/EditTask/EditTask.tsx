import React, { useState } from 'react'
import { useAppDispatch } from '../../features/hooks' // استخدام الهوك المكتوب بـ TS
import { editTask, Task } from '../../features/TaskSlice' // استيراد نوع المهمة

// 1. تعريف واجهة الـ Props
interface EditTaskProps {
    task: Task;
}

const EditTask: React.FC<EditTaskProps> = ({ task }) => {
    const [isEdit, setIsEditing] = useState<boolean>(false)
    
    // 2. تحديد أنواع الـ State (اختياري لأن TS يستنتجها من القيمة الابتدائية)
    const [title, setTitle] = useState<string>(task.title)
    const [description, setDescription] = useState<string>(task.description)
    const [status, setStatus] = useState<string>(task.status)
    
    const dispatch = useAppDispatch()

    const handleEdit = () => {
        // سيتحقق TS الآن من أن الكائن المرسل يطابق واجهة Task تماماً
        dispatch(editTask({ 
            id: task.id, 
            title, 
            description, 
            status 
        }))
        setIsEditing(false)
    }

    return (
        <div>
            {isEdit ? (
                <div className='absolute bg-white p-4 border rounded-md shadow-lg z-10'>
                    <h2 className='text-xl font-semibold mb-3 text-indigo-500'>Edit Task</h2>
                    <div className='mb-4'>
                        <input
                            type='text'
                            placeholder='Task Name'
                            value={title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <textarea
                            placeholder='Task Description'
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2'
                            rows={3}
                        ></textarea>
                    </div>
                    <div className='mb-4'>
                        <select
                            value={status}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
                            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2'
                        >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className='flex justify-between gap-2'>
                        <button
                            type='button'
                            className='bg-indigo-600 text-white py-2 px-2 rounded-md hover:bg-indigo-700'
                            onClick={handleEdit}
                        >
                            Save
                        </button>
                        <button 
                            className='bg-gray-300 py-2 px-2 rounded-md' 
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button 
                    className='px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600' 
                    onClick={() => setIsEditing(true)}
                >
                    Edit
                </button>
            )}
        </div>
    )
}

export default EditTask