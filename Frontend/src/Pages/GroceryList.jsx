import React, { useState } from 'react';

const dummyItems = [
  { id: 1, name: "Apples" },
  { id: 2, name: "Bananas" },
  { id: 3, name: "Carrots" },
  { id: 4, name: "Tomatoes" },
];

const GroceryList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleQuantityChange = (id, value) => {
    setQuantities({ ...quantities, [id]: parseInt(value) || 1 });
  };

  const addToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
      const updatedCart = cart.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity }]);
    }
  };


  const submit=()=>{
    console.log('cart : ',cart);
  }

  const filteredItems = dummyItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Grocery List</h2>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ padding: '8px', width: '100%', marginBottom: '20px' }}
      />
      {filteredItems.map((item) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            alignItems: 'center',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          <div>
            <strong>{item.name}</strong>    
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="number"
              min="1"
              value={quantities[item.id] || 1}
              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
              style={{ width: '60px' }}
            />
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        </div>
      ))}

      <h3>🛒 Cart</h3>
      {cart.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} × {item.quantity} = {item.quantity }
            </li>
          ))}
        </ul>
      )}
      <div>
        <button onClick={submit}>submit</button>
      </div>
    </div>
  );
};

export default GroceryList;