import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminPage = ({ user }) => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Sadece Claim Manager rolüne sahip kullanıcıların erişimine izin ver
  useEffect(() => {
    if (user.role !== 'Claim Manager') {
      navigate('/dashboard')
    }
  }, [user, navigate])

  // Tüm kullanıcıları yükle
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true)
        const result = await window.api.admin.getAllUsers()

        if (result.success) {
          setUsers(result.users.map((user) => user.dataValues))
          setError('')
        } else {
          setError(result.error)
        }
      } catch (error) {
        console.error('Kullanıcı yükleme hatası:', error)
        setError('Kullanıcılar yüklenirken bir hata oluştu')
      } finally {
        setIsLoading(false)
      }
    }

    if (user.role === 'Claim Manager') {
      loadUsers()
    }
  }, [user.role])

  // Kullanıcı rolünü güncelle
  const handleRoleChange = async (userId, newRole) => {
    try {
      const result = await window.api.admin.updateUserRole({ userId, role: newRole })

      if (result.success) {
        // Başarıyla güncellenirse, kullanıcı listesini güncelle
        setUsers(
          users.map((u) => {
            if (u.id === userId) {
              return { ...u, role: newRole }
            }
            return u
          })
        )
      } else {
        setError(result.error)
      }
    } catch (error) {
      console.error('Rol güncellemesi hatası:', error)
      setError('Rol güncellenirken bir hata oluştu')
    }
  }

  // Kullanıcı durumunu değiştir (aktif/deaktif)
  const handleStatusChange = async (userId, isActive) => {
    try {
      const result = await window.api.admin.updateUserStatus({ userId, isActive })

      if (result.success) {
        // Başarıyla güncellenirse, kullanıcı listesini güncelle
        setUsers(
          users.map((u) => {
            if (u.id === userId) {
              return { ...u, isActive }
            }
            return u
          })
        )
      } else {
        setError(result.error)
      }
    } catch (error) {
      console.error('Durum güncellemesi hatası:', error)
      setError('Durum güncellenirken bir hata oluştu')
    }
  }

  // Kullanıcıyı sil
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        const result = await window.api.admin.deleteUser(userId)

        if (result.success) {
          // Başarıyla silinirse, kullanıcı listesinden kaldır
          setUsers(users.filter((u) => u.id !== userId))
        } else {
          setError(result.error)
        }
      } catch (error) {
        console.error('Kullanıcı silme hatası:', error)
        setError('Kullanıcı silinirken bir hata oluştu')
      }
    }
  }

  if (user.role !== 'Claim Manager') {
    return null // Yetkisiz kullanıcılar için hiçbir şey gösterme
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    )
  }

  const userRoles = [
    'Claim Manager',
    'Legal and Contract Specialist',
    'Planning Responsible',
    'Cost Control Responsible',
    'Site Responsible'
  ]

  return (
    <div className="w-full px-12 py-8">
      <h1 className="text-2xl font-bold mb-6 text-neutral-700">User Management</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Username
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                E-mail
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((userData) => (
              <tr key={userData.id} className={!userData.isActive ? 'bg-gray-100' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{userData.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{userData.fullName || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{userData.email || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {userData.id === user.id ? (
                    // Kendi rolünü değiştiremez (Claim Manager)
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {userData.role}
                    </span>
                  ) : (
                    <select
                      value={userData.role}
                      onChange={(e) => handleRoleChange(userData.id, e.target.value)}
                      className="text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {userRoles.map((role) => (
                        <option
                          key={role}
                          value={role}
                          disabled={role === 'Claim Manager'} // Sadece bir Claim Manager olabilir
                        >
                          {role}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {userData.id === user.id ? (
                    // Kendi durumunu değiştiremez
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Aktif
                    </span>
                  ) : (
                    <div className="flex items-center">
                      <button
                        onClick={() => handleStatusChange(userData.id, !userData.isActive)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${userData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${userData.isActive ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                      <span className="ml-2 text-sm text-gray-500">
                        {userData.isActive ? 'Aktif' : 'Deaktif'}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {userData.id !== user.id && (
                    <button
                      onClick={() => handleDeleteUser(userData.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Sil
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminPage
