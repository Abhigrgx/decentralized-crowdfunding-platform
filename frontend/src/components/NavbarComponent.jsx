import { useNavigate, Link } from "react-router-dom";

export default function NavbarComponent({ address }) {
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <nav className="leftNavbarContainer">
        <div className="navItem" onClick={() => navigate("/")}>Home</div>
        <div className="navItem" onClick={() => navigate("/discover")}>Discover</div>
        <div className="navItem" onClick={() => navigate("/create_project")}>Start a project</div>
      </nav>
      <div className="centerNavbarContainer">DEFINDSTARTER</div>
      <div className="rightNavbarContainer">
        <div className="navItem">
          <Link to="/profile" state={{ address, name: address.slice(0, 6) }}>
            {address.slice(0, 5) + "..." + address.slice(-4)}
          </Link>
        </div>
      </div>
    </div>
  );
}
