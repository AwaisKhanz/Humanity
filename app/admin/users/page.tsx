"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Search, MoreVertical, UserPlus } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isAuthor: boolean
  createdAt: string
}

export default function UsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeUser, setActiveUser] = useState<string | null>(null)

  useEffect(() => {
    if (!user || user.role !== "super_admin") {
      router.push("/admin")
      return
    }

    async function fetchUsers() {
      try {
        setLoading(true)
        const response = await fetch("/api/admin/users")

        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }

        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
        toast.error("Failed to fetch users")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [user, router])

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  async function updateUserRole(userId: string, role: string) {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user role")
      }

      toast.success("User role updated successfully")

      // Update the user in the local state
      setUsers((prevUsers) => prevUsers.map((user) => (user._id === userId ? { ...user, role } : user)))

      setActiveUser(null)
    } catch (error) {
      console.error("Error updating user role:", error)
      toast.error("Failed to update user role")
    }
  }

  return (
    <div className="bg-[#f3f2f2] min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 w-full border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </div>

            {loading ? (
              <p className="text-center py-4">Loading users...</p>
            ) : filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              user.role === "super_admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "admin"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.isAuthor ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Yes</span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full"
                              onClick={() => setActiveUser(activeUser === user._id ? null : user._id)}
                            >
                              <MoreVertical className="h-5 w-5" />
                            </Button>

                            {activeUser === user._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                <div className="py-1">
                                  {user.role !== "super_admin" && (
                                    <button
                                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => updateUserRole(user._id, "super_admin")}
                                    >
                                      Make Super Admin
                                    </button>
                                  )}
                                  {user.role !== "admin" && (
                                    <button
                                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => updateUserRole(user._id, "admin")}
                                    >
                                      Make Admin
                                    </button>
                                  )}
                                  {user.role !== "user" && (
                                    <button
                                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => updateUserRole(user._id, "user")}
                                    >
                                      Make Regular User
                                    </button>
                                  )}
                                  <button
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    onClick={() => {
                                      // View user details
                                      router.push(`/admin/users/${user._id}`)
                                    }}
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4">No users found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
