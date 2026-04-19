import "./Input.css";

function Input({ placeholder, type = "text", value, onChange }) {
  return (
    <input
      className="input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default Input;