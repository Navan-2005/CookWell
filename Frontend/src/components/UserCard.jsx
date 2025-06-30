// src/components/UserCard.jsx
import React from "react";

const UserCard = ({ user }) => (
  <div className="bg-white p-4 rounded shadow-md hover:shadow-lg transition">
    <h2 className="text-xl font-semibold text-gray-800">{user.username}</h2>
    <p className="text-gray-600">📧 {user.email}</p>
    {/* <p className="text-sm text-gray-400">🆔 {user._id}</p> */}
  </div>
);

export default UserCard;
