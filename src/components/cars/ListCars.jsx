import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './list.css';


const ListCars = ({ cars: initialCars, limit = 8, showPagination = true }) => {
  const [cars, setCars] = useState(initialCars || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoverImages, setHoverImages] = useState([]);

  useEffect(() => {
    if (!initialCars) {
      fetchCars();
    } else {
      setCars(initialCars);
      setHoverImages(new Array(initialCars.length).fill(null));
    }
  }, [initialCars]);

  const fetchCars = async () => {
    try {
      const res = await axios.get("http://localhost:3000/trajets");
      setCars(res.data);
      setHoverImages(new Array(res.data.length).fill(null));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMouseEnter = (index) => {
    const newHoverImages = [...hoverImages];
    newHoverImages[index] = index;
    setHoverImages(newHoverImages);
  };

  const handleMouseLeave = (index) => {
    const newHoverImages = [...hoverImages];
    newHoverImages[index] = null;
    setHoverImages(newHoverImages);
  };

  const indexOfLastCar = currentPage * limit;
  const indexOfFirstCar = indexOfLastCar - limit;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(cars.length / limit);

  return (
    <main className="card-container">
      {currentCars.map((car, index) => (
        <div
          className="card"
          key={index}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
        >
          <img
            src="data:image/jpeg;base64,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"
            alt={`${car.depart} ${car.arrivee}`}
            className="card-image"
          />
          <div className="card-body">
            <h1 className="card-title"> 
              {car.depart} To {car.arrivee}</h1>
            <p
              className={`card-availability ${car.numTravelers > car.placesReservees ? 'available' : 'not-available'}`}
            >
              {car.numTravelers > car.placesReservees ?  'Available':'Not Available'}
            </p>
            <p className="card-price">{car.prix} $ </p>
            
            <Link to={`/reserve/${car.id}`} className="btn">
  <button className="book-now-btn">Book Now</button>
</Link>
            
          </div>
        </div>
      ))}

      {/* Pagination controls */}
      {showPagination && (
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </main>
  );
};

export default ListCars;

/* Inline CSS for wow effect */
