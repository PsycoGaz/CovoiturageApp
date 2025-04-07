import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaCar } from 'react-icons/fa';
import { AuthContext } from './auth/AuthContext';
import './menu.css';

function NavScrollExample() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  return (
    <>
      <Navbar expand="lg" className="bg-dark navbar-dark sticky-top shadow-sm">
        <div className="container-fluid">
          <Navbar.Brand href="#" className="fw-bold text-uppercase d-flex align-items-center">
            <img
              src="data:image/png;base64,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"
              alt="RentWheels Logo"
              style={{ width: '70px', marginRight: '10px', borderRadius: '50%' }}
            />
            My Way
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link as={Link} to="" className="nav-link text-white d-flex align-items-center">
                <FaHome className="me-2" /> Home
              </Nav.Link>
              <Nav.Link as={Link} to="/cars" className="nav-link text-white d-flex align-items-center">
                <FaCar className="me-2" /> Lifts
              </Nav.Link>
              <Nav.Link as={Link} to="/trajets" className="nav-link text-white d-flex align-items-center">
                <FaCar className="me-2" /> Trajets
              </Nav.Link>
              <Nav.Link as={Link} to="/create-trajets" className="nav-link text-white d-flex align-items-center">
                <FaCar className="me-2" />Add Trajets
              </Nav.Link>
              {user && user.role === 'admin' && (
                <Nav.Link as={Link} to="/dashboard" className="nav-link text-white d-flex align-items-center">
                  <FaCar className="me-2" /> Dashboard
                </Nav.Link>
              )}
            </Nav>
            <Form className="d-flex" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="search"
                placeholder="Search for Lifts..."
                className="me-2 border-0 shadow-sm"
                aria-label="Search"
                style={{ borderRadius: '20px' }}
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Button variant="success" className="shadow-sm px-4" type="submit">
                Search
              </Button>
            </Form>
            {user ? (
              <div className="d-flex align-items-center ms-3 text-white">
                <span className="me-2">Welcome, {user.firstname || user.email}!</span>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="outline-light" className="ms-3" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </Navbar.Collapse>
        </div>
      </Navbar>
      <div className="hero-space"></div>
    </>
  );
}

export default NavScrollExample;