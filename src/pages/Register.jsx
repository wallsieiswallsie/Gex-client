import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../utils/api";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    cabang: "", // ✅ Tambahan
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Nama wajib diisi";
    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }
    if (!formData.role) {
      newErrors.role = "Role wajib dipilih";
    }
    if (!formData.cabang) {
      newErrors.cabang = "Cabang wajib dipilih"; // ✅ Tambahan validasi
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const data = await registerApi(formData);

      alert("Registrasi berhasil, silakan login!");
      setFormData({ name: "", email: "", password: "", role: "", cabang: "" });
      setErrors({});
      navigate("/login");
    } catch (err) {
      alert(err.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {/* Nama */}
        <div className="form-group">
          <label>Nama</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        {/* Role */}
        <div className="form-group">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="">-- Pilih Role --</option>
            <option value="Manager Main Warehouse">Manager Main Warehouse</option>
            <option value="Manager Destination Warehouse">
              Manager Destination Warehouse
            </option>
            <option value="Staff Main Warehouse">Staff Main Warehouse</option>
            <option value="Staff Destination Warehouse">
              Staff Destination Warehouse
            </option>
            <option value="Courier">Courier</option>
          </select>
          {errors.role && <p className="error">{errors.role}</p>}
        </div>

        {/* ✅ Cabang */}
        <div className="form-group">
          <label>Cabang</label>
          <select name="cabang" value={formData.cabang} onChange={handleChange}>
            <option value="">-- Pilih Cabang --</option>
            <option value="main">Main</option>
            <option value="remu">Remu</option>
            <option value="aimas">Aimas</option>
          </select>
          {errors.cabang && <p className="error">{errors.cabang}</p>}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="routing">
        Sudah punya akun? <Link to="/login">Login di sini</Link>
      </p>
    </div>
  );
}

export default RegisterPage;