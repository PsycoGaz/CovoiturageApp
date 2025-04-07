import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TrajetList.css';

function TrajetList() {
  const [trajets, setTrajets] = useState([]);
  const [conducteurs, setConducteurs] = useState([]);
  const [voitures, setVoitures] = useState([]);
  const [filteredTrajets, setFilteredTrajets] = useState([]);
  const [filters, setFilters] = useState({
    allowSmoking: false,   // True if the user wants to see trips where smoking is allowed
    allowAnimals: false,   // True if the user wants to see trips where animals are allowed
    gender: 'both',        // 'male', 'female', 'both'
    baggage: 'none',       // 'none', 'small', 'big', 'bigWithFee'
    date: '',              // Empty string or specific date for filtering
    departureCity: '',     // Departure city for filtering
    arrivalCity: '',       // Arrival city for filtering
    priceRange: 'noRange', // Default price range set to 'noRange' (no filter)
  });

  const [isFilterVisible, setIsFilterVisible] = useState(false); // Toggle for filter visibility

  useEffect(() => {
    axios.get('http://localhost:3000/trajets')
      .then((response) => {
        setTrajets(response.data);
        setFilteredTrajets(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des trajets :', error);
      });

    axios.get('http://localhost:3000/conducteurs')
      .then((response) => {
        setConducteurs(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des conducteurs :', error);
      });

    axios.get('http://localhost:3000/voitures')
      .then((response) => {
        setVoitures(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des voitures :', error);
      });
  }, []);

  const getConducteurName = (id) => {
    const conducteur = conducteurs.find((c) => c.id === id);
    return conducteur ? `${conducteur.firstName} ${conducteur.lastName}` : 'Conducteur inconnu';
  };

  const getVoitureName = (id) => {
    const voiture = voitures.find((v) => v.id === id);
    return voiture ? `${voiture.marque} ${voiture.modele}` : 'Voiture inconnue';
  };

  const handleFilterChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (type === 'checkbox') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: checked,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  // Utility function to format the date to match the filter format (YYYY-MM-DD)
  const formatDate = (dateString) => dateString.split('T')[0];  // Just the date part

  useEffect(() => {
    let filtered = trajets;

    // If user wants to see trips where smoking is allowed
    if (filters.allowSmoking) {
      filtered = filtered.filter((trajet) => trajet.noSmoking === false); // Trips where smoking is allowed
    }

    // If user wants to see trips where animals are allowed
    if (filters.allowAnimals) {
      filtered = filtered.filter((trajet) => trajet.noAnimals === false); // Trips where animals are allowed
    }

    // Filtering by gender (male, female, or both)
    if (filters.gender !== 'both') {
      filtered = filtered.filter((trajet) => trajet.gender === filters.gender);
    }

    // Filtering by baggage (none, small, big, or bigWithFee)
    if (filters.baggage !== 'none') {
      filtered = filtered.filter((trajet) => trajet.baggage === filters.baggage);
    }

    // Filtering by date
    if (filters.date) {
      filtered = filtered.filter((trajet) => {
        const trajetDate = formatDate(trajet.date); // Convert the trajet date to YYYY-MM-DD
        return trajetDate === filters.date;
      });
    }

    // Filtering by departure city
    if (filters.departureCity) {
      filtered = filtered.filter((trajet) =>
        trajet.depart.toLowerCase().includes(filters.departureCity.toLowerCase())
      );
    }

    // Filtering by arrival city
    if (filters.arrivalCity) {
      filtered = filtered.filter((trajet) =>
        trajet.arrivee.toLowerCase().includes(filters.arrivalCity.toLowerCase())
      );
    }

    // Filtering by price range
    if (filters.priceRange !== 'noRange') {
      const priceRange = filters.priceRange.split('-');
      const minPrice = parseInt(priceRange[0], 10);
      const maxPrice = parseInt(priceRange[1], 10);
      filtered = filtered.filter((trajet) => trajet.prix >= minPrice && trajet.prix <= maxPrice);
    }

    setFilteredTrajets(filtered);
  }, [filters, trajets]);

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <div>
      <button className="filter-btn" onClick={toggleFilterVisibility}>
        Filtre
      </button>

      {isFilterVisible && (
        <div className="filters">
          <h4>Filtres</h4>

          <div>
            <label>
              <input
                type="checkbox"
                name="allowSmoking"
                checked={filters.allowSmoking}
                onChange={handleFilterChange}
              />
              🚭 Autoriser fumer
            </label>
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                name="allowAnimals"
                checked={filters.allowAnimals}
                onChange={handleFilterChange}
              />
              🐾 Autoriser animaux
            </label>
          </div>

          <div>
            <label>
              Genre :
              <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
              >
                <option value="both">Les deux</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
            </label>
          </div>

          <div>
            <label>
              Bagages :
              <select
                name="baggage"
                value={filters.baggage}
                onChange={handleFilterChange}
              >
                <option value="none">Aucun</option>
                <option value="small">Petit sac</option>
                <option value="big">Grand sac</option>
                <option value="bigWithFee">Grand sac (+20€)</option>
              </select>
            </label>
          </div>

          <div>
            <label>
              Date :
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </label>
          </div>

          <div>
            <label>
              Ville de départ :
              <input
                type="text"
                name="departureCity"
                value={filters.departureCity}
                onChange={handleFilterChange}
                placeholder="Entrez la ville de départ"
              />
            </label>
          </div>

          <div>
            <label>
              Ville d'arrivée :
              <input
                type="text"
                name="arrivalCity"
                value={filters.arrivalCity}
                onChange={handleFilterChange}
                placeholder="Entrez la ville d'arrivée"
              />
            </label>
          </div>

          <div>
            <label>
              Plage de prix :
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
              >
                <option value="noRange">Toutes les plages</option>
                <option value="0-10">0 - 10 €</option>
                <option value="10-20">10 - 20 €</option>
                <option value="20-30">20 - 30 €</option>
                <option value="30-40">30 - 40 €</option>
                <option value="40-50">40 - 50 €</option>
                <option value="50+">50 € et plus</option>
              </select>
            </label>
          </div>
        </div>
      )}

      <main className="card-container">
        {filteredTrajets.length === 0 ? (
          <p>Aucun trajet disponible.</p>
        ) : (
          filteredTrajets.map((trajet) => (
            <div className="card" key={trajet.id}>
              <div className="card-body">
                <h1 className="card-title">
                  📍 {trajet.depart} ➜ {trajet.arrivee}
                </h1>
                <p className="card-text">
                  <strong>Date :</strong> {trajet.date}<br />
                  <strong>Prix :</strong> {trajet.prix} €<br />
                  <strong>Bagage :</strong> {trajet.baggage}<br />
                  <strong>Genre :</strong> {trajet.gender}<br />
                  <strong>Places :</strong> {trajet.numTravelers}<br />
                  <strong>Conducteur :</strong> {getConducteurName(trajet.conducteurId)}<br />
                  <strong>Voiture :</strong> {getVoitureName(trajet.voitureId)}<br />
                </p>

                <div className="badges">
                  {trajet.noSmoking && (
                    <span className="badge bg-warning text-dark">🚭 Non fumeur</span>
                  )}
                  {trajet.noAnimals && (
                    <span className="badge bg-info text-dark">🐾 Pas d'animaux</span>
                  )}
                </div>

                <Link to={`/reserve/${trajet.id}`} className="btn">
                  Réserver 🚘
                </Link>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default TrajetList;
