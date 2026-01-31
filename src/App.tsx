import React, { useState } from 'react'
import './App.css'
import TaskList from './Components/TaskList/TaskList'
import AddTask from './Components/AddTask/AddTask'
import { useAppSelector } from './features/hooks';
// تعريف أنواع الفلترة المتاحة
type FilterStatus = 'All' | 'To Do' | 'In Progress' | 'Completed';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  return (
    <div className='min-h-screen bg-gray-100 p-4 md:p-10'>
      <div className='max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-6'>
        <h1 className='text-3xl font-extrabold mb-6 text-center text-indigo-600 tracking-tight'>
          Task Manager Pro
        </h1>
        <div className="text-center mb-6">
          <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Total: {tasks.length}
          </span>
          <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Completed: {completedCount}
          </span>
        </div>
        
        <AddTask />

        <div className='my-6 space-y-4'>
          {/* شريط البحث */}
          <input 
            type="text"
            placeholder="Search tasks by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />

          {/* أزرار الفلترة */}
          <div className='flex flex-wrap gap-2 justify-center'>
            {(['All', 'To Do', 'In Progress', 'Completed'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filterStatus === status 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <hr className='mb-6 border-gray-100' />

        {/* تمرير قيم البحث والفلترة للمكون المسئول عن العرض */}
        <TaskList searchTerm={searchTerm} filterStatus={filterStatus} />
      </div>
    </div>
  )
}

export default App
