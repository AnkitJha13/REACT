import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "http://localhost:5000/api";

function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    salary: "",
    address: "",
    department_id: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/employees`);
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API}/departments`);
      setDepartments(res.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId === null) {
        await axios.post(`${API}/employees`, form);
      } else {
        await axios.put(`${API}/employees/${editId}`, form);
        setEditId(null);
      }
      setForm({ name: "", email: "", salary: "", address: "", department_id: "" });
      fetchEmployees();
    } catch (error) {
      console.error("Error submitting employee form:", error);
    }
  };

  const handleEdit = (emp) => {
    setForm({
      name: emp.name,
      email: emp.email,
      salary: emp.salary,
      address: emp.address,
      department_id: emp.department_id,
    });
    setEditId(emp.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Employee Management System</h2>

      {/* Form Box */}
      <div className="d-flex justify-content-center mb-4">
        <div className="card p-4 w-50">
          <h4 className="text-center mb-4">{editId === null ? "Add Employee" : "Update Employee"}</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <input
                className="form-control"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                placeholder="Salary"
                type="number"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
              />
            </div>
            <div className="form-group mb-3">
              <input
                className="form-control"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="form-group mb-3">
              <select
                className="form-control"
                value={form.department_id}
                onChange={(e) => setForm({ ...form, department_id: e.target.value })}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.id}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary w-100" type="submit">
              {editId === null ? "Add Employee" : "Update Employee"}
            </button>
          </form>
        </div>
      </div>

      {/* Table */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Salary</th>
            <th>Address</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.salary}</td>
              <td>{emp.address}</td>
              <td>
                {departments.find((d) => d.id === emp.department_id)?.name || "N/A"}
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-info" onClick={() => handleEdit(emp)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
