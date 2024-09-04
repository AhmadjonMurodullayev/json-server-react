import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from 'react-bootstrap';

const App = () => {
  const [data, setData] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    number: '',
    price: ''
  });

  useEffect(() => {
    axios.get('http://localhost:3000/users')
      .then(res => {
        setData(res.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleCreate = () => {
    axios.post('http://localhost:3000/users', formData)
      .then(res => {
        setData([...data, res.data]);
        setShowCreateModal(false);
        setFormData({ name: '', color: '', number: '', price: '' });
      })
      .catch(error => {
        console.error("Error creating item:", error);
      });
  };

  const handleEdit = () => {
    if (!currentItem) return;
    
    axios.put(`http://localhost:3000/users/${currentItem.id}`, formData)
      .then(res => {
        const updatedData = data.map(item => item.id === currentItem.id ? res.data : item);
        setData(updatedData);
        setShowEditModal(false);
        setFormData({ name: '', color: '', number: '', price: '' });
        setCurrentItem(null);
      })
      .catch(error => {
        console.error("Error editing item:", error);
      });
  };

  const handleDelete = () => {
    if (!currentItem) return;
    
    axios.delete(`http://localhost:3000/users/${currentItem.id}`)
      .then(() => {
        setData(data.filter(item => item.id !== currentItem.id));
        setShowDeleteModal(false);
        setCurrentItem(null);
      })
      .catch(error => {
        console.error("Error deleting item:", error);
      });
  };

  const openEditModal = (item) => {
    setFormData({
      name: item.name,
      color: item.color,
      number: item.number,
      price: item.price
    });
    setCurrentItem(item);
    setShowEditModal(true);
  };

  const openDeleteModal = (item) => {
    setCurrentItem(item);
    setShowDeleteModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isFormValid = () => {
    return formData.name && formData.color && formData.number && formData.price;
  };

  return (
    <div className="container">
      <div className="row my-5">
        <div className="col">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>T/r</th>
                <th>Name</th>
                <th>Color</th>
                <th>Seri number</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.color}</td>
                  <td>{item.number}</td>
                  <td>{item.price}</td>
                  <td>
                    <Button className="btn btn-info btn-sm me-2" onClick={() => openEditModal(item)}>Edit</Button>
                    <Button className="btn btn-danger btn-sm" onClick={() => openDeleteModal(item)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>Create New</Button>
        </div>
      </div>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <Form.Control type="text" name="color" value={formData.color} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Seri number</Form.Label>
              <Form.Control type="text" name="number" value={formData.number} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleCreate} disabled={!isFormValid()}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <Form.Control type="text" name="color" value={formData.color} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Seri number</Form.Label>
              <Form.Control type="text" name="number" value={formData.number} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleEdit} disabled={!isFormValid()}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this item?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Close</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
