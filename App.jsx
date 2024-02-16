
import React, { useState, useEffect } from 'react';
import "./components/styles.css";

const cohortName = '2308-acc-et-web-pt-a';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

function App() {
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllPlayers();
  }, []);

  const fetchAllPlayers = async () => {
    try {
      const response = await fetch(`${APIURL}/players`);
      const result = await response.json();
      if (result.error) throw result.error;
      setPlayers(result.data.players);
    } catch (err) {
      console.error('Uh oh, trouble fetching players!', err);
    }
  };

  const fetchSinglePlayer = async (playerId) => {
    try {
      const response = await fetch(`${APIURL}/players/${playerId}`);
      const result = await response.json();
      if (result.error) throw result.error;
      return result.data.player;
    } catch (err) {
      console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
  };

  const addNewPlayer = async (playerObj) => {
    try {
      const response = await fetch(`${APIURL}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerObj),
      });
      const result = await response.json();
      if (result.error) throw result.error;
      const newPlayer = result.data.player;
      setPlayers([...players, newPlayer]);
    } catch (err) {
      console.error('Oops, something went wrong with adding that player!', err);
    }
  };

  const removePlayer = async (playerId) => {
    try {
      const response = await fetch(`${APIURL}/players/${playerId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.error) throw result.error;
      const updatedPlayers = players.filter(player => player.id !== playerId);
      setPlayers(updatedPlayers);
    } catch (err) {
      console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPlayers = players.filter(player => player.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <NewPlayerForm addNewPlayer={addNewPlayer} />
      <SearchBar searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <PlayerList players={filteredPlayers} fetchSinglePlayer={fetchSinglePlayer} removePlayer={removePlayer} />
    </div>
  );
}

function PlayerList({ players, fetchSinglePlayer, removePlayer }) {
  return (
    <div id="all-players-container">
      {players.map(player => (
        <div key={player.id} className="single-player-card">
          <div className="header-info">
            <p className="pup-title">{player.name}</p>
            <p className="pup-number">#{player.id}</p>
          </div>
          <img src={player.imageUrl} alt={`photo of ${player.name} the puppy`} />
          <button className="detail-button" onClick={() => fetchSinglePlayer(player.id)}>See details</button>
          <button className="delete-button" onClick={() => removePlayer(player.id)}>Remove from roster</button>
        </div>
      ))}
    </div>
  );
}

function NewPlayerForm({ addNewPlayer }) {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    addNewPlayer({ name, breed });
    setName('');
    setBreed('');
  };

  return (
    <div id="new-player-form">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor="breed">Breed:</label>
        <input type="text" id="breed" value={breed} onChange={(e) => setBreed(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

function SearchBar({ searchTerm, handleSearchChange }) {
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={handleSearchChange}
      placeholder="Search player"
    />
  );
}

export default App;
