import React, { useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import './AdminPage.css';

function AdminPage() {
  const auth = useAuth();

  const [data, setData] = useState({ categories: [], products: [] });
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    // if (!auth.isAuthenticated) return;

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

  const saveData = () => {
    fetch("https://f5u5uhnzrl.execute-api.ap-south-1.amazonaws.com/v1/update", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': '${auth.user.access_token}'
        "Authorization": "eyJraWQiOiIrUktlZ01RQ1JZN0VpZkNIYVlFWVpSSzh5R2RaTDRWUlpBMnRORWdLTDVjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI1MTczN2Q0YS0xMDUxLTcwYzItNGY5MC1jMmFkZDU2NGE5MTMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aC0xX1dzM3NabnI0bCIsInZlcnNpb24iOjIsImNsaWVudF9pZCI6ImhsZzRxOWF1MXE5NjJpZWppODgxZWVyazEiLCJvcmlnaW5fanRpIjoiMWI0NWQ4OTUtMzZlMS00MWNmLTk1ODctMWYzNmI0OGJjYzg2IiwiZXZlbnRfaWQiOiI4MTg2NTQzNy00NzQwLTQ1MGYtYTViNi1mMjc4YzBjZTU4NzMiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6InBob25lIG9wZW5pZCBlbWFpbCIsImF1dGhfdGltZSI6MTc0ODg0MjkwMywiZXhwIjoxNzQ4ODQ2NTAzLCJpYXQiOjE3NDg4NDI5MDMsImp0aSI6ImU0ZjlkNDMyLTcyZTUtNDY2OS05YzNmLTYxZTcyNGRiYzU4NyIsInVzZXJuYW1lIjoiNTE3MzdkNGEtMTA1MS03MGMyLTRmOTAtYzJhZGQ1NjRhOTEzIn0.T2gv3V4SqYti4gdbnjCYe0TiHQ_ypCnB5ZjCk4HYg27HrTdX-R_CfoX9UON11ZPVJRbawwoAYeZ_ClQL0Eb1gK_OmT4SxC8ZN94MGLMHaaHJyau2S3GL0upwCGtjHwcAUyW_BxvWCsBiM6pWQfHvvupjmPZGYZdNwwwH2BK0YuSxa2wUF4dVYIZkT863XzY2aEf2W7WzDdC1B74ccFoaeaeNxk_AnB4Szy87xSUtOYiWaXahgq4WbUUsU1C6EKWT-KovwHSm2q0Geonjz9kW5uBcZF9kqPweOqLtTnnct4NI7UGTFdwXQ-UsqYBYprtVtfco0FmBGL1xQHocY5DztA"
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save');
        alert('Data saved successfully!');
      })
      .catch(err => alert(err.message));
  };

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
    setData({ ...data, categories: newCategories });
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...data.products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setData({ ...data, products: newProducts });
  };

  const addProduct = () => {
    const newProduct = { id: Date.now().toString(), name: '', category: '', image: '', description: '' };
    setData({ ...data, products: [...data.products, newProduct] });
  };

  const removeProduct = (index) => {
    const newProducts = data.products.filter((_, i) => i !== index);
    setData({ ...data, products: newProducts });
  };

  const signOutRedirect = () => {
    auth.removeUser();
    const cognitoDomain = "https://ap-south-1ws3sznr4l.auth.ap-south-1.amazoncognito.com";
    const clientId = "hlg4q9au1q962ieji881eerk1";
    const logoutUri = "https://www.camlabs.in/";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  // if (auth.isLoading) {
  //   return <div className="admin-loading">Loading...</div>;
  // }

  // if (!auth.isAuthenticated) {
  //   return <div className="admin-not-authenticated">Please sign in to access the admin panel.</div>;
  // }

  // if (loading) {
  //   return <div className="admin-loading">Loading admin data...</div>;
  // }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h2>Admin Panel</h2>
        <p>Welcome, {auth.user?.profile.email}</p>
        <button className="btn signout-btn" onClick={signOutRedirect}>Sign out</button>
      </header>

      <section className="admin-section">
        <h3>Categories</h3>
        {data.categories.map((cat, i) => (
          <div key={i} className="admin-row">
            <input
              type="text"
              value={cat}
              onChange={e => handleCategoryChange(i, e.target.value)}
              className="admin-input"
            />
            <button className="btn remove-btn" onClick={() => removeCategory(i)}>Remove</button>
          </div>
        ))}
        <button className="btn add-btn" onClick={addCategory}>Add Category</button>
      </section>

      <section className="admin-section">
        <h3>Products</h3>
        {data.products.map((prod, i) => (
          <div key={prod.id} className="admin-product-card">
            <input
              type="text"
              placeholder="Name"
              value={prod.name}
              onChange={e => handleProductChange(i, 'name', e.target.value)}
              className="admin-input"
            />
            <input
              type="text"
              placeholder="Category"
              value={prod.category}
              onChange={e => handleProductChange(i, 'category', e.target.value)}
              className="admin-input"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={prod.image}
              onChange={e => handleProductChange(i, 'image', e.target.value)}
              className="admin-input"
            />
            <textarea
              placeholder="Description"
              value={prod.description}
              onChange={e => handleProductChange(i, 'description', e.target.value)}
              className="admin-textarea"
            />
            <button className="btn remove-btn" onClick={() => removeProduct(i)}>Remove Product</button>
          </div>
        ))}
        <button className="btn add-btn" onClick={addProduct}>Add Product</button>
      </section>

      <button className="btn save-btn" onClick={saveData}>Save Changes</button>
    </div>
  );
}

export default AdminPage;
