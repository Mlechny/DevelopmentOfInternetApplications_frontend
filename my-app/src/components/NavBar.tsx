import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


function NavigationBar() {
    return (
        <Navbar expand="lg" className="bg-primary bg-primary" >
            <div className='container-xl px-2 px-sm-3'>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Item>
                            <Link to="/languages" className="nav-link ps-0">Языки программирования</Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link to="/forms" className="nav-link">Формы на проверку</Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}

export default NavigationBar;