import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const NavBar = () => (
  <Navbar bg="primary" variant="dark" className="rounded mt-3 mb-4">
    <Container>
      <Navbar.Brand className="fw-bold">Waiter.app</Navbar.Brand>
      <Nav className="ms-auto">
        <Nav.Link as={NavLink} to="/">
          Home
        </Nav.Link>
      </Nav>
    </Container>
  </Navbar>
);

export default NavBar;
