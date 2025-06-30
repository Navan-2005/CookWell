import React from "react";

const Sidebar = ({ users, onUserSelect }) => {
  return (
    <div className="w-1/3 sm:w-1/4 bg-gray-100 border-r overflow-y-auto">
      <h2 className="text-xl font-bold p-4">Users</h2>
      {users.map(user => (
        <div
          key={user._id}
          className="p-4 hover:bg-gray-200 cursor-pointer border-b"
          onClick={() => onUserSelect(user)}
        >
          <p className="font-medium">{user.username}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
