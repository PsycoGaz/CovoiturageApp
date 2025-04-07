import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CarRentalPage.css";
import { AuthContext } from "../auth/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";

// Charger Stripe avec la clé publique
const stripePromise = loadStripe("pk_test_51QiYqyAMVwYVRU1rk3QD5PIPZEuLgDY2842i3Fj6uiXRgv4yeOANQY5FJgPzi1GwGIs3W8xdkilebr7vvMbGSWfC00i1K7raoh");

const CarRentalPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [totalCost, setTotalCost] = useState(0);
  const [traj, setTrajet] = useState(null);
  const [CondId, setCondId] = useState(null); // État pour stocker l'ID du conducteur
  const [conducteur, setConducteur] = useState(null);
  const [car, setCar] = useState(null);
  const [carId, setCarId] = useState(null); // État pour stocker l'ID de la voiture
  const [placesToReserve, setPlacesToReserve] = useState(1); // État pour le nombre de places à réserver

  // Récupérer les détails du trajet
  useEffect(() => {
    const fetchTraDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/trajets/${id}`);
        setTrajet(response.data);
        setCondId(response.data.conducteurId); // Mettre à jour CondId
        setCarId(response.data.voitureId); // Mettre à jour l'ID de la voiture
        console.log("Trajet details:", response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails du trajet :", error);
      }
    };

    fetchTraDetails();
  }, [id]);

  // Récupérer les détails du conducteur
  useEffect(() => {
    if (CondId) {
      const fetchConducteurDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/conducteurs/${CondId}`);
          setConducteur(response.data);
          console.log("Conducteur details:", response.data);
        } catch (error) {
          console.error("Erreur lors de la récupération des détails du conducteur :", error);
        }
      };

      fetchConducteurDetails();
    }
  }, [CondId]);

  // Récupérer les détails de la voiture
  useEffect(() => {
    if (carId) {
      const fetchCarDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/voitures/${carId}`);
          setCar(response.data);
          console.log("Car details:", response.data);
        } catch (error) {
          console.error("Erreur lors de la récupération des détails de la voiture :", error);
        }
      };

      fetchCarDetails();
    }
  }, [carId]);

  // Calculer le coût total en fonction du nombre de places sélectionnées
  useEffect(() => {
    if (traj) {
      setTotalCost(traj.prix * placesToReserve);
    }
  }, [traj, placesToReserve]);

  // Gérer la réservation
  const handleConfirmRent = async () => {
    if (placesToReserve > (traj.numTravelers - traj.placesReservees)) {
      alert("Nombre de places insuffisant !");
      return;
    }
  
    try {
      // Mettre à jour le nombre de places réservées dans la base de données
      const updatedTrajet = {
        ...traj,
        placesReservees: traj.placesReservees + placesToReserve, // Incrémenter les places réservées
      };
  
      await axios.put(`http://localhost:3000/trajets/${traj.id}`, updatedTrajet);
  
      // Mettre à jour localement l'état pour refléter les changements
      setTrajet(updatedTrajet);
  
      alert(`Réservation confirmée pour ${placesToReserve} places.`);
      console.log(`Réservation confirmée pour ${placesToReserve} places.`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des places réservées :", error);
      alert("Une erreur est survenue lors de la réservation. Veuillez réessayer.");
    }
  }
  // Afficher un message de chargement tant que les données ne sont pas disponibles
  if (!traj || !car) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rental-container">
      <div className="car-image">
        {car.img ? (
          <img src={car.img} alt={traj.model} />
        ) : (
          <p>Image not available</p>
        )}
      </div>
      <div className="rental-info">
        <h2>
          {traj.depart} - {traj.arrivee}
        </h2>
        <div className="date-inputs">
          <label>
            Rental date: {traj.date}
          </label>
        </div>
        <div className="cond-details">
          <p>
            <strong>Nb places:</strong> {traj.numTravelers}
          </p>
          <p>
            <strong>Places restantes:</strong> {traj.numTravelers - traj.placesReservees}
          </p>
        </div>
        {conducteur && (
          <div className="conducteur-info">
            <p>
              <strong>Conducteur:</strong> {conducteur.Nom} {conducteur.Prenom}
            </p>
            
          </div>
        )}
        {car && (
          <div className="conducteur-info">
            <p>
              <strong>Marque:</strong> {car.marque} 
            </p>
            <p>
              <strong>Modele:</strong> {car.modele}
            </p>
          </div>
        )}
        
        
        <div className="reservation-input">
          <label>
            Nombre de places à réserver:
            <input
              type="number"
              min="1"
              max={traj.numTravelers - traj.placesReservees}
              value={placesToReserve}
              onChange={(e) => setPlacesToReserve(Number(e.target.value))}
            />
          </label>
        </div>
        <div className="total">
          <p>Total</p>
          <h3>${placesToReserve*traj.prix} USD</h3>
        </div>
        <button className="confirm-btn" onClick={handleConfirmRent}>
          Confirm Rent
        </button>
      </div>
    </div>
  );
};

const Wrapper = (props) => (
  <Elements stripe={stripePromise}>
    <CarRentalPage {...props} />
  </Elements>
);

export default Wrapper;