import React, { useState, useEffect, act } from 'react';
import './Admin.css';
import axios from 'axios';

const AdminPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('menu');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // State for dishes, categories, tables
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [roles, setRoles] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [users, setUsers] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [feedbacks, setFeedbacks] = useState(null);
  const [replies, setReplies] = useState(null);

  // State for new or edited items
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    dishName: '',
    dishDescription: '',
    dishImage: '',
    dishPrice: '',
    nameChef: '',
    categoryDishId: ''
  });
  
  // State for new or edited categories
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    categoryName: '',
    categoryDescription: ''
  });

  // State for new or edited tables
  const [editingTable, setEditingTable] = useState(null);
  const [newTable, setNewTable] = useState({
    tableName: '',
    tableSeat: '',
    tableKind: '',
    tableStatus: 'AVAILABLE',
    tableLocation: ''
  });

  // State for new or edited users
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    roles: []
  });

  const [editingRole, setEditingRole] = useState(null);
  const [newRole, setNewRole] = useState({
    roleName: '',
    roleDescription: '',
    permissions: []
  });

  // State for new or edited roles
  const [editingPermission, setEditingPermission] = useState(null);
  const [newPermission, setNewPermission] = useState({
    permissionName: '',
    description: ''
  });

  // State for bookings
  const [editingBookings, setEditingBookings] = useState(null);
  const [newBookings, setNewBookings] = useState({
    bookingTime: '',
    tableId: '',
  });


  // Fetch dishes from API
  const fetchDishes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/restaurant/dishes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.result) {
        setMenuItems(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching dishes:', error);
      setError('Failed to load dishes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/restaurant/category-dishes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.result) {
        const fetchedCategories = response.data.result;
        setCategories(fetchedCategories);

        // Set the default category for new items
        if (fetchedCategories.length > 0) {
          setNewItem((prevState) => ({
            ...prevState,
            categoryDishId: fetchedCategories[0].categoryDishId
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch tables from API
  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/restaurant/tables', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.result) {
        setTables(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/restaurant/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.result) {
        setUsers(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/restaurant/roles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && response.data.result) {
        setRoles(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Fetch permissions from API
  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/restaurant/permissions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && response.data.result) {
        setPermissions(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/restaurant/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && response.data.result) {
        setBookings(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/restaurant/feedbacks`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && response.data.result) {
        setFeedbacks(response.data.result);
      } else {
        console.error('No feedbacks found');
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  // Fetch replies from API
  const fetchReplies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/restaurant/replies`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && response.data.result) {
        setReplies(response.data.result);
      } else {
        console.error('No replies found');
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  }


  // Load data when component mounts
  useEffect(() => {
    fetchDishes();
    fetchCategories();
    fetchTables();
    fetchUsers();
    fetchRoles();
    fetchPermissions();
    fetchBookings();
    fetchFeedbacks();
    fetchReplies();
  }, []);

  const handleItemChange = (e) => {
    const { name, value, files } = e.target;
    
    // Xử lý nếu là input file
    if (name === 'image' && files && files.length > 0) {
      const file = files[0];
      
      // Kiểm tra xem có phải file ảnh không
      if (!file.type.match('image.*')) {
        setError('Vui lòng chọn file ảnh');
        return;
      }
      
      // Đọc file và chuyển đổi thành Base64
      const reader = new FileReader();
      reader.onload = (event) => {
        // Base64 string
        const base64Image = event.target.result;
        
        // Cập nhật Base64 string vào state
        if (editingItem) {
          setEditingItem({
            ...editingItem,
            dishImage: base64Image
          });
        } else {
          setNewItem({
            ...newItem,
            dishImage: base64Image
          });
        }
      };
      
      // Đọc file dưới dạng Base64 URL
      reader.readAsDataURL(file);
    } 
    // Xử lý các trường input khác
    else {
      if (editingItem) {
        setEditingItem({
          ...editingItem,
          [name]: value
        });
      } else {
        setNewItem({
          ...newItem,
          [name]: value
        });
      }
    }
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        [name]: value
      });
    } else {
      setNewCategory({
        ...newCategory,
        [name]: value
      });
    }
  };

  const handleTabChange = (e) => {
    const {name, value} = e.target;
    if (editingTable) {
        setEditingTable({
            ...editingTable,
            [name]: value
        });
    } else {
        setNewTable({
            ...newTable,
            [name]: value
        });
    }
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    if (editingUser) {
      if (name === 'role') {
        setEditingUser({
          ...editingUser,
          roles: [value] // Just send the role name as a string in an array
        });
      } else {
        setEditingUser({
          ...editingUser,
          [name]: value
        });
      }
    } else {
      if (name === 'role') {
        setNewUser({
          ...newUser,
          roles: [value] // Just send the role name as a string in an array
        });
      } else {
        setNewUser({
          ...newUser,
          [name]: value
        });
      }
    }
  };


  const handleRoleChange = (e) => {
    const { name, value } = e.target;
    if (editingRole) {
      setEditingRole({
        ...editingRole,
        [name]: value
      });
    } else {
      setNewRole({
        ...newRole,
        [name]: value
      });
    }
  };

  const handlePermissionChange = (e) => {
    const { name, value } = e.target;
    if (editingPermission) {
      setEditingPermission({
        ...editingPermission,
        [name]: value
      });
    } else {
      setNewPermission({
        ...newPermission,
        [name]: value
      });
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    if (editingBookings) {
      setEditingBookings({
        ...editingBookings,
        [name]: value
      });
    } else {
      setNewBookings({
        ...newBookings,
        [name]: value
      });
    }
  };

  // Add a new dish
  const addNewItem = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Đưa ảnh đến thư mục assets/images
    
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:8000/restaurant/dishes',
        newItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Xử lý phản hồi như trước
      if (response.data && response.data.result) {
        console.log('Dish added successfully:', response.data);
        fetchDishes();
        setNewItem({
          dishName: '',
          dishDescription: '',
          dishImage: '',
          dishPrice: '',
          nameChef: '',
          categoryDishId: categories.length > 0 ? categories[0].categoryDishId : ''
        });
        setSelectedFile(null);
        setImagePreview(null);
      }
    } catch (error) {
      // Xử lý lỗi như trước
      console.error('Error adding dish:', newItem.dishImage);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        setError(`Failed to add dish: ${error.response.data?.message || error.response.statusText}`);
      } else {
        setError(`Lỗi: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing dish
  const updateItem = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      alert(editingItem.categoryDishId);
      const response = await axios.put(
        `http://localhost:8000/restaurant/dishes/${editingItem.dishId}`,
        editingItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        // Refresh dish list
        fetchDishes();
        // Reset editing state
        setEditingItem(null);
      }
      setSelectedFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error updating dish:', error);
      setError('Failed to update dish. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete dish
  const deleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this dish?')) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:8000/restaurant/dishes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        // Refresh dish list
        fetchDishes();
      } catch (error) {
        console.error('Error deleting dish:', error);
        setError('Failed to delete dish. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Add a new category
  const addNewCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/restaurant/category-dishes',
        newCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.result) {
        // Refresh category list
        fetchCategories();
        // Reset form
        setNewCategory({ CategoryName: '', CategoryDescription: '' });
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category. Please try again.');
    }
  };

  // Update existing category
  const updateCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/restaurant/category-dishes/${editingCategory.categoryId}`,
        editingCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        // Refresh category list
        fetchCategories();
        // Reset editing state
        setEditingCategory(null);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category. Please try again.');
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này? Tất cả món ăn trong danh mục cũng sẽ bị xóa.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:8000/restaurant/category-dishes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        // Refresh category and dish lists
        fetchCategories();
        fetchDishes();
      } catch (error) {
        console.error('Error deleting category:', error);
        setError('Failed to delete category. Please try again.');
      }
    }
  };

  // Add a new table
  const addNewTable = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/restaurant/tables',
        newTable,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.result) {
        // Refresh table list
        fetchTables();
        // Reset form
        setNewTable({ name: '', seats: 2, status: 'available', position: '' });
      }
    } catch (error) {
      console.error('Error adding table:', error);
      setError('Failed to add table. Please try again.');
    }
  };

  // Update existing table
  const updateTable = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/restaurant/tables/${editingTable.tableId}`,
        editingTable,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        // Refresh table list
        fetchTables();
        // Reset editing state
        setEditingTable(null);
      }
    } catch (error) {
      console.error('Error updating table:', error);
      setError('Failed to update table. Please try again.');
    }
  };

  // Delete table
  const deleteTable = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bàn này?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:8000/restaurant/tables/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        // Refresh table list
        fetchTables();
      } catch (error) {
        console.error('Error deleting table:', error);
        setError('Failed to delete table. Please try again.');
      }
    }
  };

  // Add a new user
  const addNewUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/restaurant/users',
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.result) {
        // Refresh user list
        fetchUsers();
        // Reset form
        setNewUser({
          username: '',
          password: '',
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          role: ''
        });
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user. Please try again.');
    }
  };

  // Update existing user
  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      // Create the user data object matching the expected format
      const userData = {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        phoneNumber: editingUser.phoneNumber,
        dob: editingUser.dob || null,
        image: editingUser.image || null,
        roleNames: editingUser.roles // This should already be an array of strings from handleUserChange
      };

      const response = await axios.put(
        `http://localhost:8000/restaurant/users/${editingUser.userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        // Refresh user list
        fetchUsers();
        // Reset editing state
        setEditingUser(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again.');
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:8000/restaurant/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        // Refresh user list
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  // Add a new role
  const addNewRole = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/restaurant/roles',
        newRole,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.result) {
        // Refresh role list
        fetchRoles();
        // Reset form
        setNewRole({ roleName: '', roleDescription: '' });
      }
    } catch (error) {
      console.error('Error adding role:', error);
      setError('Failed to add role. Please try again.');
    }
  };

  // Update existing role
  const updateRole = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/restaurant/roles/${editingRole.roleId}`,
        editingRole,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        // Refresh role list
        fetchRoles();
        // Reset editing state
        setEditingRole(null);
      }
    } catch (error) {
      console.error('Error updating role:', error);
      setError('Failed to update role. Please try again.');
    }
  };

  // Delete role
  const deleteRole = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa quyền này?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:8000/restaurant/roles/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        // Refresh role list
        fetchRoles();
      } catch (error) {
        console.error('Error deleting role:', error);
        setError('Failed to delete role. Please try again.');
      }
    }
  };

  // Add a new permission
  const addNewPermission = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/restaurant/permissions',
        newPermission,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.result) {
        // Refresh permission list
        fetchPermissions();
        // Reset form
        setNewPermission({ permissionName: '', permissionDescription: '' });
      }
    } catch (error) {
      console.error('Error adding permission:', error);
      setError('Failed to add permission. Please try again.');
    }
  };

  // Update existing permission
  const updatePermission = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/restaurant/permissions/${editingPermission.permissionId}`,
        editingPermission,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        // Refresh permission list
        fetchPermissions();
        // Reset editing state
        setEditingPermission(null);
      }
    } catch (error) {
      console.error('Error updating permission:', error);
      setError('Failed to update permission. Please try again.');
    }
  };

  // Delete permission
  const deletePermission = async (permissionName) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa quyền này?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:8000/restaurant/permissions/${permissionName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        // Refresh permission list
        fetchPermissions();
      } catch (error) {
        console.error('Error deleting permission:', error);
        setError('Failed to delete permission. Please try again.');
      }
    }
  };

  // Add a new booking
  const addNewBooking = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/restaurant/bookings',
        newBookings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.result) {
        alert('Đặt bàn thành công');
        // Refresh booking list
        fetchBookings();
        // Reset form
        setNewBookings({ bookingTime: '', tableId: '' });
      }
    } catch (error) {
      console.error('Error adding booking:', error);
      setError('Failed to add booking. Please try again.');
    }
  };

  // Update existing booking
  const updateBooking = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/restaurant/bookings/${editingBookings.bookingId}`,
        editingBookings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        // Refresh booking list
        fetchBookings();
        // Reset editing state
        setEditingBookings(null);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      setError('Failed to update booking. Please try again.');
    }
  };

  // Delete booking
  const deleteBooking = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đặt bàn này?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:8000/restaurant/bookings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        // Refresh booking list
        fetchBookings();
      } catch (error) {
        console.error('Error deleting booking:', error);
        setError('Failed to delete booking. Please try again.');
      }
    }
  };


  return (
    <div className="admin-overlay">
      <div className="admin-panel">
        <div className="admin-header">
          <h2>Quản lý nhà hàng</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="admin-tabs">
          <button 
            className={activeTab === 'menu' ? 'active' : ''} 
            onClick={() => setActiveTab('menu')}
          >
            Danh sách món ăn
          </button>
          <button 
            className={activeTab === 'categories' ? 'active' : ''} 
            onClick={() => setActiveTab('categories')}
          >
            Loại món ăn
          </button>

          <button
            className={activeTab === 'tables' ? 'active' : ''} 
            onClick={() => setActiveTab('tables')}
          >
            Danh sách bàn
          </button>

          <button
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => setActiveTab('users')}
          >
            Danh sách người dùng
          </button>

          <button
            className={activeTab === 'roles' ? 'active' : ''} 
            onClick={() => setActiveTab('roles')}
          >
            Danh sách vai trò
          </button>
          <button
            className={activeTab === 'permissions' ? 'active' : ''} 
            onClick={() => setActiveTab('permissions')}
          >
            Danh sách quyền
          </button>

          <button
            className={activeTab === 'bookings' ? 'active' : ''} 
            onClick={() => setActiveTab('bookings')}
          >
            Danh sách đặt bàn
          </button>

          <button
            className={activeTab === 'feedbacks' ? 'active' : ''}
            onClick={() => setActiveTab('feedbacks')}
          >
            Danh sách nhận xét
          </button>

          <button
            className={activeTab === 'replies' ? 'active' : ''}
            onClick={() => setActiveTab('replies')}
          >
            Danh sách phản hồi
          </button>
        </div>

        {activeTab === 'menu' && (
          <div className="admin-content">
            <h3>Quản lý món ăn</h3>

            {/* Add category filter */}
            <div className="filter-container">
              <label htmlFor="categoryFilter">Lọc theo danh mục: </label>
              <select 
                id="categoryFilter" 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map(cat => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {isLoading ? (
              <div className="loading">Loading...</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên món ăn</th>
                    <th>Mô tả</th>
                    <th>Giá</th>
                    <th>Tên đầu bếp</th>
                    <th>Ảnh</th>
                    <th>Danh mục</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems
                  .filter(item => categoryFilter === 'all' || 
                    (item.categoryDish && item.categoryDish.categoryId.toString() === categoryFilter))
                  .map((item, index) => (
                    <tr key={item.dishId}>
                      <td>{index + 1}</td>
                      <td>{item.dishName}</td>
                      <td>{item.dishDescription}</td>
                      <td>{item.dishPrice}</td>
                      <td>{item.nameChef}</td>
                      <td>
                        {item.dishImage && (
                          <img
                            src={item.dishImage}
                            alt={item.dishName}
                            style={{ width: '100px', height: '100px' }}
                          />
                        )}
                      </td>
                      <td>
                        {item.categoryDish?.categoryName}
                      </td>
                      <td>
                        <button 
                          className="edit-btn"
                          onClick={() => {
                            setEditingItem(item);
                            setImagePreview(item.dishImage);
                            setSelectedFile(item.dishImage);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteItem(item.dishId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            <div className="admin-form">
              <h4>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h4>
              <form onSubmit={editingItem ? updateItem : addNewItem}>
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    name="dishName" 
                    value={editingItem ? editingItem.dishName : newItem.dishName}
                    onChange={handleItemChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    name="categoryDishId" 
                    value={editingItem ? editingItem.categoryDish?.categoryId : newItem.categoryDishId}
                    onChange={handleItemChange}
                    required
                  >
                    <option value="" disabled>---Select Category---</option>
                    {categories.map(cat => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName} - {cat.categoryDescription}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input 
                    type="text" 
                    name="dishPrice" 
                    value={editingItem ? editingItem.dishPrice : newItem.dishPrice}
                    onChange={handleItemChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    name="dishDescription" 
                    value={editingItem ? editingItem.dishDescription : newItem.dishDescription}
                    onChange={handleItemChange} 
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Chef Name</label>
                  <input 
                    type="text" 
                    name="nameChef" 
                    value={editingItem ? editingItem.nameChef : newItem.nameChef}
                    onChange={handleItemChange} 
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="image">Ảnh món ăn</label>
                      <input
                          type="file"
                          id="image"
                          name="image"
                          accept="image/*"
                          onChange={handleItemChange}
                          disabled={isLoading}
                      />
                      {/* Show image preview if available */}
                      {((editingItem && editingItem.dishImage) || (!editingItem && newItem.dishImage)) && (
                        <div>
                          <img
                            src={(editingItem ? editingItem.dishImage : newItem.dishImage)}
                            alt="Preview"
                            style={{ width: '100px', height: '100px', marginTop: '10px' }}
                          />
                        </div>
                      )}
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-btn" disabled={isLoading}>
                    {isLoading ? 'Processing...' : editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                  {editingItem && (
                    <button 
                      type="button" 
                      className="cancel-btn" 
                      onClick={() => {
                        setEditingItem(null);
                        setImagePreview(null);
                        setSelectedFile(null);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
        
        {activeTab === 'categories' && (
          <div className="admin-content">
            <h3>Manage Categories</h3>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Display Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                { // count chạy từ 0 đến categories.length - 1
                categories.map((category, index) => (
                  <tr key={category.categoryId}>
                    <td>{index + 1}</td>
                    <td>{category.categoryName}</td>
                    <td>{category.categoryDescription}</td>
                    <td>
                      <button 
                        className="edit-btn"
                        onClick={() => setEditingCategory(category)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteCategory(category.categoryId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="admin-form">
              <h4>{editingCategory ? 'Edit Category' : 'Add New Category'}</h4>
              <form onSubmit={editingCategory ? updateCategory : addNewCategory}>
                <div className="form-group">
                  <label>Name (unique identifier)</label>
                  <input 
                    type="text" 
                    name="categoryName" 
                    value={editingCategory ? editingCategory.categoryName : newCategory.categoryName}
                    onChange={handleCategoryChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Display Name</label>
                  <input 
                    type="text" 
                    name="categoryDescription" 
                    value={editingCategory ? editingCategory.categoryDescription : newCategory.categoryDescription}
                    onChange={handleCategoryChange} 
                    required 
                  />
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-btn">
                    {editingCategory ? 'Update Category' : 'Add Category'}
                  </button>
                  {editingCategory && (
                    <button 
                      type="button" 
                      className="cancel-btn" 
                      onClick={() => setEditingCategory(null)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'tables' && (
            <div className="admin-content">
                <h3>Manage Tables</h3>
                
                <table className="admin-table">
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Số ghế ngồi</th>
                    <th>Loại</th>
                    <th>Trạng thái</th>
                    <th>Vị trí</th>
                    <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {tables.map((table, index) => (
                    <tr key={table.id}>
                        <td>{index + 1}</td>
                        <td>{table.tableName}</td>
                        <td>{table.tableSeat}</td>
                        <td>{table.tableKind}</td>
                        <td>{table.tableStatus}</td>
                        <td>{table.tableLocation}</td>
                        <td>
                        <button 
                            className="edit-btn"
                            onClick={() => setEditingTable(table)}
                        >
                            Edit
                        </button>
                        <button 
                            className="delete-btn"
                            onClick={() => deleteTable(table.id)}
                        >
                            Delete
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
    
                <div className="admin-form">
              <h4>{editingItem ? 'Edit Table' : 'Add New Table'}</h4>
              <form onSubmit={editingTable ? updateTable : addNewTable}>
                <div className="form-group">
                    <label>Tên</label>
                    <input 
                        type="text" 
                        name="tableName"
                        placeholder="Tên bàn" 
                        value={editingTable ? editingTable.tableName : newTable.tableName}
                        onChange={handleTabChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Số ghế ngồi</label>
                    <input 
                        type="number" 
                        name="tableSeat" 
                        value={editingTable ? editingTable.tableSeat : newTable.tableSeat}
                        onChange={handleTabChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Trạng thái</label>
                    <select 
                        name="tableStatus" 
                        value={editingTable ? editingTable.tableStatus : newTable.tableStatus}
                        onChange={handleTabChange}
                    >
                        {/* luôn cài đặt để kiểu dấu gạch ---Trạng thái--- trên đầu nêu không chọn gì */}
                        <option value="" disabled>---Trạng thái---</option>
                        <option value="AVAILABLE">Có sẵn</option>
                        <option value="BOOKED">Đã đặt</option>
                        <option value="UNAVAILABLE">Không có sẵn</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Vị trí</label>
                    <input 
                        type="text" 
                        name="tableLocation" 
                        value={editingTable ? editingTable.tableLocation : newTable.tableLocation}
                        onChange={handleTabChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Loại bàn</label>
                    <select 
                        name="tableKind" 
                        value={editingTable ? editingTable.tableKind : newTable.tableKind}
                        onChange={handleTabChange}
                    >
                      {/* Để kiểu dấu gạch ---Loại bàn--- trên đầu */}
                        <option value="" disabled>---Loại bàn---</option>
                        <option value="OLD">Bàn cũ</option>
                        <option value="NEW">Bàn mới</option>
                    </select>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-btn">
                    {editingTable ? 'Cập nhật mục' : 'Thêm mục'}
                  </button>
                  {editingTable && (
                    <button 
                      type="button" 
                      className="cancel-btn" 
                      onClick={() => setEditingTable(null)}
                    >
                      Hủy
                    </button>
                  )}
                </div>
              </form>
            </div>
            </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-content">
            <h3>Manage Users</h3>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Không cần map admin */}
                {users && users.filter(user => 
                  !(user.roles &&  user.roles.some(role => role.roleName === "ADMIN"))
                ).map((user, index) => (
                  <tr key={user.userId}>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.roles ? user.roles.map(role => role.roleName).join(', ') : 'No role assigned'}</td>
                    <td>
                      <button 
                        className="edit-btn"
                        onClick={() => setEditingUser(user)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteUser(user.userId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="admin-form">
              <h4>{editingUser ? 'Edit User' : 'Add New User'}</h4>
              <form onSubmit={editingUser ? updateUser : addNewUser}>
                <div>
                  <label>Username</label>
                  <input
                    type='text'
                    name='username'
                    value={editingUser ? editingUser.username : newUser.username}
                    onChange={handleUserChange}
                    required
                  />
                </div>
                {!editingUser && (
                  <div>
                    <label>Password</label>
                    <input
                      type='password'
                      name='password'
                      value={newUser.password}
                      onChange={handleUserChange}
                      required
                    />
                  </div>
                )}
                <div>
                  <label>Email</label>
                  <input
                    type='email'
                    name='email'
                    value={editingUser ? editingUser.email : newUser.email}
                    onChange={handleUserChange}
                    required
                  />
                </div>

                <div>
                  <label>First Name</label>
                  <input
                    type='text'
                    name='firstName'
                    value={editingUser ? editingUser.firstName : newUser.firstName}
                    onChange={handleUserChange}
                    required
                  />
                </div>
                <div>
                  <label>Last Name</label>
                  <input
                    type='text'
                    name='lastName'
                    value={editingUser ? editingUser.lastName : newUser.lastName}
                    onChange={handleUserChange}
                    required
                  />
                </div>
                <div>
                  <label>Phone</label>
                  <input
                    type='text'
                    name='phoneNumber'
                    value={editingUser ? editingUser.phoneNumber : newUser.phoneNumber}
                    onChange={handleUserChange}
                    required
                  />
                </div>
                <div>
                  <label>Role</label>
                  <select
                    name='role'
                    value={editingUser ? editingUser.roles[0]?.roleName : newUser.roles}
                    onChange={handleUserChange}
                    required
                  >
                    <option value="" disabled>---Select Role---</option>
                    {roles && roles.filter(role => role.roleName !== "ADMIN").map(role => (
                      <option key={role.roleName} value={role.roleName}>
                        {role.roleName} - {role.description}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-buttons">
                  <button type="submit" className="save-btn">
                    {editingUser ? 'Update User' : 'Add User'}
                  </button>
                  {editingUser && (
                    <button 
                      type="button" 
                      className="cancel-btn" 
                      onClick={() => setEditingUser(null)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

          </div>
        )}

        {activeTab === 'roles' && (
          <div className="admin-content">
            <h3>Manage Roles</h3>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles && roles.filter(role => 
                  !(role.roleName === "ADMIN")
                ).map((role, index) => (
                  <tr key={role.roleName}>
                    <td>{index + 1}</td>
                    <td>{role.roleName}</td>
                    <td>{role.description}</td>
                    <td>{role.permissions && role.permissions.length > 0 
                        ? role.permissions.map(permission => permission.permissionName).join(', ') 
                        : 'No permissions assigned'}
                    </td>
                    <td>
                      <button 
                        className="edit-btn"
                        onClick={() => setEditingRole(role)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteRole(role.roleName)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="admin-form">
              <h4>{editingRole ? 'Edit Role' : 'Add New Role'}</h4>
              <form onSubmit={editingRole ? updateRole : addNewRole}>
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    name="roleName" 
                    value={editingRole ? editingRole.roleName : newRole.roleName}
                    onChange={handleRoleChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input 
                    type="text" 
                    name="description" 
                    value={editingRole ? editingRole.description : newRole.description}
                    onChange={handleRoleChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Permissions</label>
                <div className="selected-permissions">
                  <p>Current permissions:</p>
                  {editingRole && editingRole.permissions && editingRole.permissions.length > 0 ? (
                    <ul className="permissions-list">
                      {editingRole.permissions.map(perm => (
                        <li key={perm.permissionName}>
                          {perm.permissionName} - {perm.description}
                          <button 
                            type="button" 
                            className="remove-btn"
                            onClick={() => {
                              setEditingRole({
                                ...editingRole,
                                permissions: editingRole.permissions.filter(
                                  p => p.permissionName !== perm.permissionName
                                )
                              });
                            }}
                          >
                            X
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No permissions selected</p>
                  )}
                </div>
              
                <div className="add-permission">
                  <select 
                    name="selectedPermission"
                    onChange={(e) => {
                      const selected = permissions.find(p => p.permissionName === e.target.value);
                      if (selected && editingRole) {
                        // Check if permission already exists
                        if (!editingRole.permissions.some(p => p.permissionName === selected.permissionName)) {
                          setEditingRole({
                            ...editingRole,
                            permissions: [...editingRole.permissions, selected]
                          });
                        }
                      } else if (selected) {
                        setNewRole({
                          ...newRole,
                          permissions: [...newRole.permissions, selected]
                        });
                      }
                      // Reset the select after adding
                      e.target.value = '';
                    }}
                  >
                    <option value="" disabled selected>---Select Permission to Add---</option>
                    {permissions && permissions
                      .filter(permission => {
                        // Filter out permissions that are already selected
                        if (editingRole && editingRole.permissions) {
                          return !editingRole.permissions.some(
                            p => p.permissionName === permission.permissionName
                          );
                        }
                        if (newRole && newRole.permissions) {
                          return !newRole.permissions.some(
                            p => p.permissionName === permission.permissionName
                          );
                        }
                        return true;
                      })
                      .map(permission => (
                        <option key={permission.permissionName} value={permission.permissionName}>
                          {permission.permissionName} - {permission.description}
                        </option>
                      ))
                    }
                  </select>
                </div>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-btn">
                    {editingRole ? 'Update Role' : 'Add Role'}
                  </button>
                  {editingRole && (
                    <button 
                      type="button" 
                      className="cancel-btn" 
                      onClick={() => setEditingRole(null)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="admin-content">
            <h3>Manage Permissions</h3>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission, index) => (
                  <tr key={permission.permissionId}>
                    <td>{index + 1}</td>
                    <td>{permission.permissionName}</td>
                    <td>{permission.description}</td>
                    <td>
                      <button 
                        className="edit-btn"
                        onClick={() => setEditingPermission(permission)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deletePermission(permission.permissionName)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="admin-form">
              <h4>{editingPermission ? 'Edit Permission' : 'Add New Permission'}</h4>
              <form onSubmit={editingPermission ? updatePermission : addNewPermission}>
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    name="permissionName" 
                    value={editingPermission ? editingPermission.permissionName : newPermission.permissionName}
                    onChange={handlePermissionChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input 
                    type="text" 
                    name="description" 
                    value={editingPermission ? editingPermission.description : newPermission.description}
                    onChange={handlePermissionChange} 
                    required 
                  />
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-btn">
                    {editingPermission ? 'Update Permission' : 'Add Permission'}
                  </button>
                  {editingPermission && (
                    <button 
                      type="button" 
                      className="cancel-btn" 
                      onClick={() => setEditingPermission(null)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="admin-content">
            <h3>Manage Bookings</h3>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Table</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking.bookingId}>
                    <td>{index + 1}</td>
                    <td>{booking.user.username}</td>
                    <td>{booking.table.tableName}</td>
                    <td>{new Date(booking.bookingTime).toLocaleString()}</td>
                    <td>
                      <button 
                        className="edit-btn"
                        onClick={() => setEditingBookings(booking)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteBooking(booking.bookingId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add Booking Form */}
            <div className="admin-form">
              <h4>{editingBookings ? 'Edit Booking' : 'Add New Booking'}</h4>
              <form onSubmit={editingBookings ? updateBooking : addNewBooking}>
                <div className="form-group">
                  <label>User</label>
                  <label htmlFor="username">Tên đăng nhập</label>
                      <input 
                          type="text" 
                          id="username" 
                          value={editingBookings === null ? '' : editingBookings.user.username}
                          onChange={handleBookingChange} 
                          disabled 
                      />
                      <span className="form-note">Tên đăng nhập không thể thay đổi</span>
                </div>
                <div className="form-group">
                  <label>Table</label>
                  <select 
                    name="tableId" 
                    value={editingBookings ? editingBookings.table.tableId : newBookings.tableId}
                    onChange={handleBookingChange} 
                    required 
                  >
                    <option value="" disabled>---Select Table---</option>
                    {tables.map(table => (
                      <option key={table.tableId} value={table.tableId}>
                        {table.tableName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="datetime-local" 
                    name="bookingTime" 
                    value={
                      editingBookings 
                      ? new Date(editingBookings.bookingTime).toISOString().slice(0, 16) 
                      : newBookings.bookingTime}
                    onChange={handleBookingChange} 
                    required 
                  />
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-btn">
                    {editingBookings ? 'Update Booking' : 'Add Booking'}
                  </button>
                  {editingBookings && (
                    <button 
                      type="button" 
                      className="cancel-btn" 
                      onClick={() => setEditingBookings(null)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

          </div>
        )}

        {activeTab === 'feedbacks' && (
            <div className="admin-content">
              <h3>Manage Feedbacks</h3>
              
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Khách hàng</th>
                    <th>Nội dung</th>
                    <th>Món ăn</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((feedback, index) => (
                    <tr key={feedback.feedBackId}>
                      <td>{index + 1}</td>
                      <td>{feedback.user.username}</td>
                      <td>{feedback.feedBackContent}</td>
                      <td>{feedback.dish.dishName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
        )}

        {activeTab === 'replies' && (
          <div className="admin-content">
            <h3>Manage Replies</h3>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Người dùng</th>
                  <th>Nội dung nhận xét</th>
                  <th>Nội dung phản hồi</th>
                </tr>
              </thead>
              <tbody>
                {replies.map((reply, index) => (
                  <tr key={reply.replyId}>
                    <td>{index + 1}</td>
                    <td>{reply.user.username}</td>
                    <td>{reply.feedBack.feedBackContent}</td>
                    <td>{reply.replyContent}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;