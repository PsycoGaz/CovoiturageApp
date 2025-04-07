import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import './createTrajet.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Createtrajet() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    departure: '',
    arrival: '',
    date: '',
    time: '',
    estimatedTime: '',
    numTravelers: 1,
    noSmoking: false,
    noAnimals: false,
    gender: 'both',
    car: '',
    prix: '',
    baggage: 'none',
    extraFee: 0,
  });

  const [cars, setCars] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/voitures')
      .then((response) => setCars(response.data))
      .catch((error) => console.error('Error fetching cars:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTrajet = {
      depart: formData.departure,
      arrivee: formData.arrival,
      date: formData.date,
      prix: formData.prix,
      conducteurId: 1,
      voitureId: formData.car,
      baggage: formData.baggage,
      noSmoking: formData.noSmoking,
      noAnimals: formData.noAnimals,
      gender: formData.gender,
      numTravelers: formData.numTravelers, // Ensure numTravelers is included here
    };

    axios
      .post('http://localhost:3000/trajets', newTrajet)
      .then((response) => {
        console.log('Trajet created successfully:', response.data);
        navigate('/cars/trajets');
      })
      .catch((error) => {
        console.error('Error creating trajet:', error);
      });
  };

  const handleBaggageChange = (e) => {
    const selectedBaggage = e.target.value;
    let extraFee = selectedBaggage === 'bigWithFee' ? 20 : 0;

    setFormData({ ...formData, baggage: selectedBaggage, extraFee });
  };

  const handleAddCar = () => {
    navigate('/add-car');
  };

  // Get the current date and time in ISO format (e.g., "2025-04-06T13:00")
  const currentDateTime = new Date().toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm

  return (
    <div className="create-trajet-container">
      <h2>Créer un Trajet</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="departure">
          <Form.Label>Départ</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez le lieu de départ"
            value={formData.departure}
            required
            onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="arrival">
          <Form.Label>Arrivée</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez la destination d'arrivée"
            value={formData.arrival}
            required
            onChange={(e) => setFormData({ ...formData, arrival: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="date">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="datetime-local"
            value={formData.date}
            min={currentDateTime} // Ensure the date is in the future
            required
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="prix">
          <Form.Label>Prix (€)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Entrez le prix du trajet"
            value={formData.prix}
            required
            onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="baggage">
          <Form.Label>Sélectionner votre bagage</Form.Label>
          <div>
            {['none', 'small', 'big', 'bigWithFee'].map((option) => (
              <label key={option} style={{ marginRight: '10px' }}>
                <input
                  type="radio"
                  name="baggage"
                  value={option}
                  checked={formData.baggage === option}
                  onChange={handleBaggageChange}
                />
                {' '}
                {option === 'none'
                  ? 'Aucun Bagage'
                  : option === 'small'
                  ? 'Petit Sac'
                  : option === 'big'
                  ? 'Grand Sac'
                  : 'Grand Sac (+20€)'}
              </label>
            ))}
          </div>
        </Form.Group>

        <Form.Group controlId="numTravelers">
          <Form.Label>Nombre de voyageurs</Form.Label>
          <Form.Control
            as="select"
            value={formData.numTravelers}
            required
            onChange={(e) => setFormData({ ...formData, numTravelers: e.target.value })}
          >
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="gender">
          <Form.Label>Genre des passagers</Form.Label>
          <Form.Control
            as="select"
            value={formData.gender}
            required
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          >
            <option value="male">Homme</option>
            <option value="female">Femme</option>
            <option value="both">Les deux</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="noAnimals">
          <Form.Check
            type="checkbox"
            label="Pas d'animaux"
            checked={formData.noAnimals}
            onChange={(e) => setFormData({ ...formData, noAnimals: e.target.checked })}
          />
        </Form.Group>

        <Form.Group controlId="noSmoking">
          <Form.Check
            type="checkbox"
            label="Pas de fumer"
            checked={formData.noSmoking}
            onChange={(e) => setFormData({ ...formData, noSmoking: e.target.checked })}
          />
        </Form.Group>

        <Form.Group controlId="car">
          <Form.Label>Choisir une voiture</Form.Label>
          <Form.Control
            as="select"
            value={formData.car}
            required
            onChange={(e) => setFormData({ ...formData, car: e.target.value })}
          >
            <option value="">Sélectionnez votre voiture</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.modele} - {car.marque}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button variant="secondary" onClick={handleAddCar} className="mt-3">
          Ajouter Voiture
        </Button>

        <Button variant="primary" type="submit" className="mt-3">
          Créer Trajet
        </Button>
      </Form>
    </div>
  );
}

export default Createtrajet;
