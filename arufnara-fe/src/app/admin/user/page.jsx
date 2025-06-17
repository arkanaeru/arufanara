"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Search,
  Filter,
} from "lucide-react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../_services/users";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    point: 0,
    role: "user",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Gagal mengambil data pengguna");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setCurrentUser(null);
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      point: 0,
      role: "user",
    });
    setIsModalOpen(true);
    setError(null);
  };

  const openEditModal = (user) => {
    setModalMode("edit");
    setCurrentUser(user);
    setFormData({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      password: "",
      point: user.point || user.points || 0,
      role: user.role || "user",
    });
    setIsModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      point: 0,
      role: "user",
    });
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "point" ? parseInt(value) || 0 : value,
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.name.trim()) errors.push("Nama tidak boleh kosong");
    if (!formData.username.trim()) errors.push("Username tidak boleh kosong");
    if (!formData.email.trim()) errors.push("Email tidak boleh kosong");
    if (modalMode === "create" && !formData.password)
      errors.push("Password tidak boleh kosong");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      errors.push("Format email tidak valid");
    }
    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      let responseData;
      if (modalMode === "create") {
        responseData = await createUser(formData);
        setUsers((prev) => [...prev, responseData]);
      } else {
        const userId = currentUser.id || currentUser._id;
        if (!userId) throw new Error("ID user tidak ditemukan");
        const submitData = { ...formData };
        if (!submitData.password) delete submitData.password;
        responseData = await updateUser(userId, submitData);
        setUsers((prev) =>
          prev.map((user) =>
            (user.id || user._id) === userId
              ? { ...user, ...responseData }
              : user
          )
        );
      }
      closeModal();
    } catch (err) {
      setError(
        `Gagal ${modalMode === "create" ? "membuat" : "mengupdate"} pengguna`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (user) => {
    const userId = user.id || user._id;
    if (!userId) {
      setError("ID user tidak ditemukan");
      return;
    }
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      try {
        await deleteUser(userId);
        setUsers((prev) => prev.filter((u) => (u.id || u._id) !== userId));
      } catch (err) {
        setError("Gagal menghapus pengguna");
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const userName = user.name || "";
    const userUsername = user.username || "";
    const userEmail = user.email || "";
    const userRole = user.role || "user";
    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || userRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600">Kelola data User</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
          >
            <Plus size={20} />
            Tambah User
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 mb-6 border-l-4 border-red-400 rounded-r-lg bg-red-50">
          <div className="flex items-start justify-between">
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, username, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-xl rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100">
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-left text-blue-900 uppercase border-b border-blue-200">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-left text-blue-900 uppercase border-b border-blue-200">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-left text-blue-900 uppercase border-b border-blue-200">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-left text-blue-900 uppercase border-b border-blue-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => (
                  <tr
                    key={user.id || user._id}
                    className={`transition-colors duration-150 ${
                      idx % 2 === 0 ? "bg-white" : "bg-blue-50/60"
                    } hover:bg-blue-100/60`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-blue-900">
                            {user.name || user.username || "Unknown"}
                          </div>
                          <div className="text-sm text-blue-500">
                            @{user.username || "unknown"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-900 border-b border-blue-100">
                      {user.email || "-"}
                    </td>
                    <td className="px-6 py-4 border-b border-blue-100">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2 text-sm border-b border-blue-100">
                      <button
                        onClick={() => openEditModal(user)}
                        className="inline-flex items-center px-3 py-1 text-blue-700 transition-colors bg-blue-100 rounded-lg shadow hover:bg-blue-200"
                      >
                        <Edit size={14} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="inline-flex items-center px-3 py-1 text-red-700 transition-colors bg-red-100 rounded-lg shadow hover:bg-red-200"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-blue-400"
                  >
                    <div className="flex flex-col items-center">
                      <User className="w-12 h-12 mb-4 text-blue-200" />
                      <p className="text-lg font-semibold">
                        Tidak ada pengguna ditemukan
                      </p>
                      <p className="text-sm">
                        Cobalah mengubah filter pencarian atau tambah pengguna
                        baru
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={closeModal}
            ></div>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalMode === "create" ? "Tambah User Baru" : "Edit User"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Error Display */}
              {error && (
                <div className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Nama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan username"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan alamat email"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Password{" "}
                    {modalMode === "create" && (
                      <span className="text-red-500">*</span>
                    )}
                    {modalMode === "edit" && (
                      <span className="text-xs text-gray-500">
                        (kosongkan jika tidak ingin mengubah)
                      </span>
                    )}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={modalMode === "create"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={
                      modalMode === "create"
                        ? "Masukkan password"
                        : "Kosongkan jika tidak diubah"
                    }
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Points
                  </label>
                  <input
                    type="number"
                    name="point"
                    value={formData.point}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex justify-end pt-4 space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    {isSubmitting
                      ? "Menyimpan..."
                      : modalMode === "create"
                      ? "Simpan"
                      : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}