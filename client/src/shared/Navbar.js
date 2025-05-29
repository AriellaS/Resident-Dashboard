import { useNavigate } from 'react-router-dom';
import BootstrapNavbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import ajax from '~/util';
import useToken from '~/useToken';
import useCurrentUser from '~/useCurrentUser';

const Navbar = () => {

    const navigate = useNavigate();
    const { removeToken } = useToken();
    const { removeCurrentUser } = useCurrentUser();

    const handleLogout = async() => {
        await ajax.request('post','/logout')
            .then(res => {
                removeToken();
                removeCurrentUser();
                navigate('/login');
            }).catch(err => {
                console.log(err);
            });
    }

    return (
        <BootstrapNavbar sticky='top' bg='light' data-bs-theme='light'>
            <Container>
                <Nav className='me-auto'>
                    <Nav.Link href='/'>Home</Nav.Link>
                </Nav>
                <Nav className='justify-content-end'>
                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </Nav>
            </Container>
        </BootstrapNavbar>
    )
}

export default Navbar;
