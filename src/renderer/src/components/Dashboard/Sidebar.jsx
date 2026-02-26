import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation()

  // Aktif link kontrolü
  const isActive = (path) => {
    return location.pathname === path
      ? 'bg-gray-900 text-white'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
  }

  return (
    <div className="bg-gray-800 w-64 flex flex-col">
      <div className="px-4 py-5 border-b border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-10 w-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user.fullName || user.username}</p>
            <p className="text-xs font-medium text-gray-400">{user.email || ''}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-2 py-4 space-y-1">
        <Link
          to="/dashboard"
          className={`${isActive('/dashboard')} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
        >
          <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Görevler
        </Link>

        <Link
          to="/dashboard/add"
          className={`${isActive('/dashboard/add')} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
        >
          <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Görev Ekle
        </Link>
      </div>

      <div className="px-4 py-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-300 hover:bg-gray-700 hover:text-red-100"
        >
          <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Çıkış Yap
        </button>
      </div>
    </div>
  )
}

export default Sidebar
