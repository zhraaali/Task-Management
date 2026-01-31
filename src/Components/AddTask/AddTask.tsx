import React, { useState } from 'react'
import { v4 as uuid4 } from 'uuid'
import { addTask, Task } from '../../features/TaskSlice'
import { useAppDispatch } from '../../features/hooks' // استخدام الهوك المخصص

const AddTask: React.FC = () => {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [status, setStatus] = useState<string>('To Do')
  
  const dispatch = useAppDispatch()

  // تحديد نوع الحدث e كـ React.FormEvent
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // إنشاء كائن يلتزم بواجهة Task
    const newTask: Task = {
      id: uuid4(),
      title,
      description,
      status,
    }

    dispatch(addTask(newTask))
    
    // إعادة تعيين الحقول
    setTitle('')
    setDescription('')
    setStatus('To Do')
  }

  return (
    <form className='mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100' onSubmit={handleSubmit}>
        <h2 className='text-xl font-semibold mb-4 text-indigo-600'>Add New Task</h2>
        
        <div className='mb-4'>
            <input
              type='text'
              placeholder='Task Name'
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required 
            />
        </div>

        <div className='mb-4'>
            <textarea
                placeholder='Task Description'
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                rows={3}
            ></textarea>
        </div>

        <div className='mb-4'>
            <select
                value={status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>
        </div>

        <button
            type='submit'
            className='w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors shadow-md'>
            Add Task
        </button>
    </form>
  )
}

export default AddTask