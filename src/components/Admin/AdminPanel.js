import React, { useState } from 'react';
import './Admin.css';

const AdminPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('menu');
  
  // Mock data for menu items
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Bruschetta', category: 'starters', price: '$8.99', description: 'Toasted bread with tomatoes, garlic and basil' },
    { id: 2, name: 'Spaghetti Carbonara', category: 'mains', price: '$14.99', description: 'Classic carbonara with pancetta and egg' },
    { id: 3, name: 'Tiramisu', category: 'desserts', price: '$7.99', description: 'Coffee-flavored Italian dessert' }
  ]);
  
  // Mock data for categories
  const [categories, setCategories] = useState([
    { id: 1, name: 'starters', displayName: 'Starters' },
    { id: 2, name: 'mains', displayName: 'Main Courses' },
    { id: 3, name: 'desserts', displayName: 'Desserts' }
  ]);

//   Mock data for tables
  const [tables, setTables] = useState([
    { id: 1, name: 'Table 1', seats: 2, status: 'available', position: 'Window' },
    { id: 2, name: 'Table 2', seats: 4, status: 'reserved', position: 'Inside' },
    { id: 3, name: 'Table 3', seats: 6, status: 'occupied', position: 'Outside' }
  ])

  // State for new or edited items
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'starters',
    price: '',
    description: ''
  });
  
  // State for new or edited categories
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    displayName: ''
  });

    // State for new or edited tables
    const [editingTable, setEditingTable] = useState(null);
    const [newTable, setNewTable] = useState({
        name: '',
        seats: 2,
        status: '',
        position: ''
    });

  const handleItemChange = (e) => {
    const { name, value } = e.target;
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
    const {name , value} = e.target;
    if (editingTable) {
        setEditingTable({
            ...editingTable,
            [name]: value
        });
    }else{
        setNewTable({
            ...newTable,
            [name]: value
        });
    }
};

  const addNewItem = (e) => {
    e.preventDefault();
    const newId = Math.max(...menuItems.map(item => item.id)) + 1;
    setMenuItems([...menuItems, { ...newItem, id: newId }]);
    setNewItem({ name: '', category: 'starters', price: '', description: '' });
  };

  const updateItem = (e) => {
    e.preventDefault();
    setMenuItems(menuItems.map(item => 
      item.id === editingItem.id ? editingItem : item
    ));
    setEditingItem(null);
  };

  const deleteItem = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa món ăn này?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  const addNewCategory = (e) => {
    e.preventDefault();
    const newId = Math.max(...categories.map(cat => cat.id)) + 1;
    setCategories([...categories, { ...newCategory, id: newId }]);
    setNewCategory({ name: '', displayName: '' });
  };

  const updateCategory = (e) => {
    e.preventDefault();
    setCategories(categories.map(cat => 
      cat.id === editingCategory.id ? editingCategory : cat
    ));
    setEditingCategory(null);
  };

  const deleteCategory = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này? Tất cả món ăn trong danh mục cũng sẽ bị xóa.')) {
      const categoryToDelete = categories.find(cat => cat.id === id);
      setCategories(categories.filter(cat => cat.id !== id));
      setMenuItems(menuItems.filter(item => item.category !== categoryToDelete.name));
    }
  };

    const addNewTable = (e) => {
        e.preventDefault();
        const newId = Math.max(...tables.map(table => table.id)) + 1;
        setTables([...tables, { ...newTable, id: newId }]);
        setNewTable({ name: '', seats: 2, status: '', position: '' });
    }

    const updateTable = (e) => {
        e.preventDefault();
        setTables(tables.map(table => 
            table.id === editingTable.id ? editingTable : table
        ));
        setEditingTable(null);
    }

    const deleteTable = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bàn này?')) {
            setTables(tables.filter(table => table.id !== id));
        }
    }


  return (
    <div className="admin-overlay">
      <div className="admin-panel">
        <div className="admin-header">
          <h2>Restaurant Management</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="admin-tabs">
          <button 
            className={activeTab === 'menu' ? 'active' : ''} 
            onClick={() => setActiveTab('menu')}
          >
            Menu Items
          </button>
          <button 
            className={activeTab === 'categories' ? 'active' : ''} 
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>

          <button
            className={activeTab === 'tables' ? 'active' : ''} 
            onClick={() => setActiveTab('tables')}
          >
            Menu Tables
          </button>
        </div>
        
        {activeTab === 'menu' && (
          <div className="admin-content">
            <h3>Manage Menu Items</h3>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{categories.find(cat => cat.name === item.category)?.displayName}</td>
                    <td>{item.price}</td>
                    <td>
                      <button 
                        className="edit-btn"
                        onClick={() => setEditingItem(item)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteItem(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="admin-form">
              <h4>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h4>
              <form onSubmit={editingItem ? updateItem : addNewItem}>
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={editingItem ? editingItem.name : newItem.name}
                    onChange={handleItemChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    name="category" 
                    value={editingItem ? editingItem.category : newItem.category}
                    onChange={handleItemChange}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.displayName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input 
                    type="text" 
                    name="price" 
                    value={editingItem ? editingItem.price : newItem.price}
                    onChange={handleItemChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    name="description" 
                    value={editingItem ? editingItem.description : newItem.description}
                    onChange={handleItemChange} 
                    required
                  />
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-btn">
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                  {editingItem && (
                    <button 
                      type="button" 
                      className="cancel-btn" 
                      onClick={() => setEditingItem(null)}
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
                {categories.map(category => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.displayName}</td>
                    <td>
                      <button 
                        className="edit-btn"
                        onClick={() => setEditingCategory(category)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteCategory(category.id)}
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
                    name="name" 
                    value={editingCategory ? editingCategory.name : newCategory.name}
                    onChange={handleCategoryChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Display Name</label>
                  <input 
                    type="text" 
                    name="displayName" 
                    value={editingCategory ? editingCategory.displayName : newCategory.displayName}
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
                    <th>Name</th>
                    <th>Seats</th>
                    <th>Status</th>
                    <th>Position</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tables.map(table => (
                    <tr key={table.id}>
                        <td>{table.id}</td>
                        <td>{table.name}</td>
                        <td>{table.seats}</td>
                        <td>{table.status}</td>
                        <td>{table.position}</td>
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
                    <label>Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={editingTable ? editingTable.name : newTable.name}
                        onChange={handleTabChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Seats</label>
                    <input 
                        type="number" 
                        name="seats" 
                        value={editingTable ? editingTable.seats : newTable.seats}
                        onChange={handleTabChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Status</label>
                    <select 
                        name="status" 
                        value={editingTable ? editingTable.status : newTable.status}
                        onChange={handleTabChange}
                    >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="occupied">Occupied</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Position</label>
                    <input 
                        type="text" 
                        name="position" 
                        value={editingTable ? editingTable.position : newTable.position}
                        onChange={handleTabChange} 
                        required 
                    />
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-btn">
                    {editingTable ? 'Update Item' : 'Add Item'}
                  </button>
                  {editingTable && (
                    <button 
                      type="button" 
                      className="cancel-btn" 
                      onClick={() => setEditingTable(null)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;