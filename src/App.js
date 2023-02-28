import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://www.mocky.io/v2/5ba8efb23100007200c2750c';

const App = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  const highlight = (text) => {
    if (!searchQuery) {
      return text;
    }
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };
  const handleSearchInputChange = event => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(user => {
      const matchesId = user.id.toString().toLowerCase().includes(query);
      const matchesName = user.name.toLowerCase().includes(query);
      const matchesAddress = user.address.toLowerCase().includes(query);
      const matchesPincode = user.pincode.toString().toLowerCase().includes(query);
      const matchesItems = user.items.some(item => item.toLowerCase().includes(query));
      return matchesId || matchesName || matchesAddress || matchesPincode || matchesItems;
    });
    setFilteredUsers(filtered);
    setSelectedUserIndex(-1);
  };

  const handleCardClick = index => {
    setSelectedUserIndex(index);
  };

  const handleCardKeyDown = event => {
    if (event.key === 'ArrowUp' && selectedUserIndex > 0) {
      setSelectedUserIndex(selectedUserIndex - 1);
    } else if (event.key === 'ArrowDown' && selectedUserIndex < filteredUsers.length - 1) {
      setSelectedUserIndex(selectedUserIndex + 1);
    } else if (event.key === 'Enter' && selectedUserIndex !== -1) {
      // Handle user selection (e.g. redirect to user profile page)
    }
  };

  useEffect(() => {
    if (selectedUserIndex !== -1 && listRef.current) {
      const cardElement = listRef.current.children[selectedUserIndex];
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [selectedUserIndex]);

  return (
    <div className="App">
      <div className="search-box">
        <input type="search" placeholder="Search users" value={searchQuery} onChange={handleSearchInputChange} />
      </div>
      <div className="card-list" ref={listRef}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div
              key={user.id}
              className={`card ${index === selectedUserIndex ? 'selected' : ''}`}
              onClick={() => handleCardClick(index)}
              onKeyDown={handleCardKeyDown}
              tabIndex={0}
            >
              <div className="card-header">{highlight(user.name)}</div>
              <div className="card-body">
                <p>ID: {highlight(user.id)}</p>
                <p>Address: {highlight(user.address)}</p>
                <p>Pincode: {highlight(user.pincode)}</p>
                {user.items.map((item, i) => (
                <span key={i}>{highlight(item)}</span>))}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-card">No results found</div>
        )}
      </div>
    </div>
  );
}

export default App;
