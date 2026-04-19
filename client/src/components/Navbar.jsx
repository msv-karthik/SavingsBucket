import "./Navbar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token"); 
        navigate("/"); 
    };
  return (
    <div className="navbar">
      <h2>Savings App</h2>
       <ul>
         <li><Link to="/dashboard">Dashboard</Link></li>
         <li><Link to="/transactions">Transactions</Link></li>
         <li><Link to="/transfer">Transfers</Link></li> 
         <li><Link to="/buckets">Buckets</Link></li>
         <li><button onClick={handleLogout}>Logout</button></li>
       </ul>

    </div>
  );
}

export default Navbar;


