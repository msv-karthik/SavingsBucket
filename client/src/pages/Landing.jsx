import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import { useEffect, useState } from "react";
import "../styles/landing.css";


const AnimatedCard = ({ title, target, total }) => {
  const [value, setValue] = useState(target * 0.6);

  useEffect(() => {
    let direction = 1;

    const interval = setInterval(() => {
      setValue((prev) => {
        let next = prev + direction * (total * 0.005);

        if (next >= target) {
          direction = -1;
          next = target;
        } else if (next <= target * 0.6) {
          direction = 1;
          next = target * 0.6;
        }

        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [target, total]);

  const percent = (value / total) * 100;

  return (
    <div className="mock-card">
      <h4>{title}</h4>

      <p>
        ₹ {Math.floor(value).toLocaleString()} / ₹{" "}
        {total.toLocaleString()}
      </p>

      <div className="progress">
        <div
          className="progress-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">

      <div className="landing-left">
        <h1>
          Smart Savings <br />
          <span>Made Simple</span>
        </h1>

        <p>
          Organize your money into buckets, track goals, and
          build better financial habits effortlessly.
        </p>

        <div className="landing-actions">
          <Button onClick={() => navigate("/signup")}>
            Get Started
          </Button>

          <Button onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>
      </div>


      <div className="landing-right">
        <AnimatedCard
          title="Travel Fund"
          target={25000}
          total={50000}
        />

        <AnimatedCard
          title="Emergency Fund"
          target={80000}
          total={100000}
        />
      </div>
    </div>
  );
};

export default Landing;