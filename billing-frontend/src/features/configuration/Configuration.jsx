import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Shield } from 'lucide-react';
import categoryService from '../../services/categoryService';
import { useAuth } from '../../context/AuthContext';
import './Configuration.css';

const Configuration = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('General');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New category form state
  const [newCat, setNewCat] = useState({ name: '', description: '', type: 'expense' });
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', type: 'expense' });
  const [editError, setEditError] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories('all'); // Show all in config
      if (res.success) setCategories(res.data);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ── Create ──
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setAddError('');
    try {
      const res = await categoryService.createCategory(newCat);
      if (res.success) {
        setCategories(prev => [...prev, res.data]);
        setNewCat({ name: '', description: '', type: 'expense' });
        setIsAdding(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create category';
      setAddError(msg);
    }
  };

  // ── Edit ──
  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditForm({ 
      name: cat.name, 
      description: cat.description || '',
      type: cat.type || 'expense'
    });
    setEditError('');
  };

  const handleSaveEdit = async (id) => {
    setEditError('');
    try {
      const res = await categoryService.updateCategory(id, editForm);
      if (res.success) {
        setCategories(prev => prev.map(c => c._id === id ? res.data : c));
        setEditingId(null);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update category';
      setEditError(msg);
    }
  };

  // ── Soft Delete ──
  const handleDelete = async (id) => {
    try {
      const res = await categoryService.deleteCategory(id);
      if (res.success) {
        setCategories(prev => prev.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete category', err);
    }
  };

  const tabs = [
    { name: 'General', icon: <Shield size={18} /> },
  ];

  return (
    <div className="config-container">
      <div className="config-header">
        <h1>Configuration</h1>
        <p>Manage expense categories and system settings.</p>
      </div>

      <div className="config-layout">
        <aside className="config-tabs">
          {tabs.map(tab => (
            <button
              key={tab.name}
              className={`tab-btn${activeTab === tab.name ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </aside>

        <div className="config-content">
          {/* ── Category Management ── */}
          <section className="config-section">
            <div className="section-header">
              <div>
                <h2>System Categories</h2>
                <p>Define categories for organizing expenses and collections.</p>
              </div>
              {isAdmin && !isAdding && (
                <button className="btn-primary" onClick={() => { setIsAdding(true); setAddError(''); }}>
                  <Plus size={18} />
                  Add Category
                </button>
              )}
            </div>

            <div className="category-list">
              {/* Add row */}
              {isAdding && (
                <form className="category-item editing" onSubmit={handleAddCategory}>
                  <div className="item-info">
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={newCat.name}
                      onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                      required
                      autoFocus
                    />
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={newCat.description}
                      onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                    />
                    <select 
                      value={newCat.type}
                      onChange={(e) => setNewCat({ ...newCat, type: e.target.value })}
                      required
                    >
                      <option value="expense">For Expenses</option>
                      <option value="collection">For Collections</option>
                      <option value="both">For Both</option>
                    </select>
                    {addError && <span className="inline-error">{addError}</span>}
                  </div>
                  <div className="item-actions">
                    <button type="submit" className="btn-icon-success"><Check size={18} /></button>
                    <button type="button" className="btn-icon-danger" onClick={() => { setIsAdding(false); setAddError(''); }}><X size={18} /></button>
                  </div>
                </form>
              )}

              {loading && <p style={{ padding: '1rem', opacity: 0.6 }}>Loading categories...</p>}
              {error && <p style={{ padding: '1rem', color: 'var(--danger)' }}>{error}</p>}

              {!loading && categories.map((cat) => (
                <div key={cat._id} className={`category-item${cat.status === 'inactive' ? ' inactive-row' : ''}`}>
                  {editingId === cat._id ? (
                    <>
                      <div className="item-info">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          required
                          autoFocus
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        />
                        <select 
                          value={editForm.type}
                          onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                          required
                        >
                          <option value="expense">For Expenses</option>
                          <option value="collection">For Collections</option>
                          <option value="both">For Both</option>
                        </select>
                        {editError && <span className="inline-error">{editError}</span>}
                      </div>
                      <div className="item-actions">
                        <button className="btn-icon-success" onClick={() => handleSaveEdit(cat._id)}><Check size={18} /></button>
                        <button className="btn-icon-danger" onClick={() => setEditingId(null)}><X size={18} /></button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="item-info">
                          <div className="item-name-row">
                          <h3>{cat.name}</h3>
                          <span className={`type-badge ${cat.type || 'expense'}`}>
                            {cat.type === 'both' ? 'Both' : (cat.type === 'collection' ? 'Collection' : 'Expense')}
                          </span>
                        </div>
                        <p>{cat.description || <em>No description</em>}</p>
                      </div>
                      <div className="item-actions">
                        {isAdmin && cat.status === 'active' && (
                          <>
                            <button className="btn-icon-ghost" onClick={() => startEdit(cat)} title="Edit">
                              <Edit2 size={16} />
                            </button>
                            <button className="btn-icon-ghost danger" onClick={() => handleDelete(cat._id)} title="Deactivate">
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>


        </div>
      </div>
    </div>
  );
};

export default Configuration;
