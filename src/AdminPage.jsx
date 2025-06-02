import React, { useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import './AdminPage.css';

function Modal({ message, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <p>{message}</p>
        <button className="btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function AdminPage() {
  const auth = useAuth();

  const [data, setData] = useState({ categories: [], products: [] });
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    if (!auth.isAuthenticated) return;

    fetch("https://s3.ap-south-1.amazonaws.com/camlabs.in/content.json")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [auth]);

  const handleCategoryChange = (index, value) => {
    const newCategories = [...data.categories];
    newCategories[index] = value;
    setData({ ...data, categories: newCategories });
  };

  const addCategory = () => {
    setData({ ...data, categories: [...data.categories, ''] });
  };

  const removeCategory = (index) => {
    const newCategories = data.categories.filter((_, i) => i !== index);
    const categoryToRemove = data.categories[index];
    const filteredProducts = data.products.filter(p => p.category !== categoryToRemove);
    setData({ categories: newCategories, products: filteredProducts });
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...data.products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setData({ ...data, products: newProducts });
  };

  const addProductToCategory = (category) => {
    const newProduct = { id: Date.now().toString(), name: '', category, image: '', description: '' };
    setData({ ...data, products: [...data.products, newProduct] });
  };

  const removeProduct = (index) => {
    const newProducts = data.products.filter((_, i) => i !== index);
    setData({ ...data, products: newProducts });
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });

  const [uploading, setUploading] = React.useState({});

  const handleFileUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Set uploading true for this product ID
      const productId = data.products[index].id;
      setUploading(prev => ({ ...prev, [productId]: true }));

      // Convert file to base64 (assuming fileToBase64 is defined)
      const base64Content = await fileToBase64(file);
      const body = {
        fileName: file.name,
        contentType: file.type,
        fileContent: base64Content,
      };

      const res = await fetch(
        "https://okotnfuiu8.execute-api.ap-south-1.amazonaws.com/upload",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${auth.user.access_token}`
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);

      const result = await res.json();

      if (!result.url) throw new Error("Upload failed: no url returned");

      // Update product image URL
      const newProducts = [...data.products];
      newProducts[index].image = result.url;
      setData({ ...data, products: newProducts });

    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      // Clear uploading state regardless of success/failure
      const productId = data.products[index].id;
      setUploading(prev => ({ ...prev, [productId]: false }));
    }
  };


  const [saving, setSaving] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);

  const saveData = () => {
    setSaving(true);
    fetch("https://f5u5uhnzrl.execute-api.ap-south-1.amazonaws.com/v1/update", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.user.access_token}`
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        setSaving(false);
        if (!res.ok) throw new Error('Failed to save');

        setModalMessage("All set! Your changes have been deployed and will appear shortly.");
        setShowModal(true);
      })
      .catch(err => {
        setSaving(false);
        alert(err.message);
      });
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };


  // Placeholder for your signOutRedirect method
  const signOutRedirect = () => {
    auth.removeUser();
    const cognitoDomain = "https://ap-south-1ws3sznr4l.auth.ap-south-1.amazoncognito.com";
    const clientId = "hlg4q9au1q962ieji881eerk1";
    const logoutUri = "https://www.camlabs.in/";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  // Group products by category for rendering
  const productsByCategory = data.categories.reduce((acc, cat) => {
    acc[cat] = data.products.filter(p => p.category === cat);
    return acc;
  }, {});

  if (loading) return <div className="admin-loading">Loading...</div>;
  if (!auth.user) return <div className="admin-not-authenticated">Please login to access admin panel</div>;

  if (loading) {
    return <div className="admin-loading">Loading admin data...</div>;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h2>Admin Panel</h2>
        <p>Welcome, {auth.user?.profile.email}</p>
        <button className="btn signout-btn" onClick={signOutRedirect}>Sign out</button>
      </header>

      <section className="categories-tiles-container">
        {data.categories.map((cat, catIndex) => (
          <div key={catIndex} className="category-tile">
            <div className="category-header">
              <label className="category-label" htmlFor={`category-${catIndex}`}>
                Category Name
              </label>
              <div className="category-input-row">
                <input
                  id={`category-${catIndex}`}
                  type="text"
                  value={cat}
                  onChange={e => handleCategoryChange(catIndex, e.target.value)}
                  className="admin-input category-input"
                  placeholder="Enter category name"
                />
                <button className="btn remove-btn" onClick={() => removeCategory(catIndex)}>
                  Remove Category
                </button>
              </div>
            </div>




            <div className="products-list">
              {(productsByCategory[cat] || []).map((prod, prodIndex) => {
                const globalIndex = data.products.findIndex(p => p.id === prod.id);
                return (
                  <div key={prod.id} className="admin-product-card">
                    <div className="product-card-header">
                      {prod.category}
                    </div>

                    <div className="outlined-input-group">
                      <input
                        id={`name-${prod.id}`}
                        type="text"
                        placeholder=" "
                        value={prod.name}
                        onChange={e => handleProductChange(globalIndex, 'name', e.target.value)}
                        className="outlined-input"
                      />
                      <label htmlFor={`name-${prod.id}`} className="outlined-label">Name</label>
                    </div>
                    <small
                      style={{
                        wordBreak: 'break-word',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block',
                        maxWidth: '100%',
                        color: '#888',
                      }}>
                      {prod.image}
                    </small>

                    <div className="file-upload-container">
                      <label className="image-upload-preview">
                        <img
                          src={data.products[globalIndex].image || "/No_Image_Available.jpg"}
                          alt="Preview"
                          className="image-preview"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileUpload(e, globalIndex)}
                          disabled={uploading[data.products[globalIndex].id]}
                          hidden
                        />
                      </label>
                      {uploading[data.products[globalIndex].id] && <div className="spinner"></div>}
                    </div>
                    <textarea
                      placeholder="Description"
                      value={prod.description}
                      onChange={e => handleProductChange(globalIndex, 'description', e.target.value)}
                      className="admin-textarea"
                    />
                    <div className="outlined-input-group">
                      <input
                        type="number"
                        placeholder="Actual Price"
                        id={`price-${prod.id}`}
                        value={prod.price}
                        onChange={e => handleProductChange(globalIndex, 'price', e.target.value)}
                        className="outlined-input"
                      />
                      <label htmlFor={`price-${prod.id}`} className="outlined-label">Actual Price</label>
                    </div>
                    <div className="outlined-input-group">
                      <input
                        type="number"
                        placeholder="Offer Price"
                        id={`offerPrice-${prod.id}`}
                        value={prod.offerPrice}
                        onChange={e => handleProductChange(globalIndex, 'offerPrice', e.target.value)}
                        className="outlined-input"
                      />
                      <label htmlFor={`offerPrice-${prod.id}`} className="outlined-label">Offer Price</label>
                    </div>
                    <button className="btn remove-btn" onClick={() => removeProduct(globalIndex)}>Remove Product</button>
                  </div>
                );
              })}
            </div>

            <button className="btn add-btn" onClick={() => addProductToCategory(cat)}>Add Product</button>
          </div>
        ))}
      </section>

      <div className="admin-actions">
        <button className="btn add-btn" onClick={addCategory}>Add Category</button>
        <button className="btn save-btn" onClick={saveData}>Save Changes</button>
      </div>

      {saving && (
        <div className="page-spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {showModal && <Modal message={modalMessage} onClose={closeModal} />}

    </div>
  );
}

export default AdminPage;
