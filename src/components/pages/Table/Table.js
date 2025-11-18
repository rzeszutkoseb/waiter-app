import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import {
  getTableById,
  getTablesRequest,
  updateTableRequest,
} from '../../../redux/tablesRedux';

const Table = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const table = useSelector(state => getTableById(state, id));
  const request = useSelector(getTablesRequest);

  const [status, setStatus] = useState('Free');
  const [peopleAmount, setPeopleAmount] = useState(0);
  const [maxPeopleAmount, setMaxPeopleAmount] = useState(0);
  const [bill, setBill] = useState(0);

  useEffect(() => {
    if (table) {
      setStatus(table.status);
      setPeopleAmount(table.peopleAmount);
      setMaxPeopleAmount(table.maxPeopleAmount);
      setBill(table.bill);
    }
  }, [table]);

  useEffect(() => {
    if (!request.pending && !table) {
      navigate('/');
    }
  }, [request.pending, table, navigate]);

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const handleStatusChange = e => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    if (newStatus === 'Free' || newStatus === 'Cleaning') {
      setPeopleAmount(0);
      setBill(0);
    }
  };

  const handlePeopleAmountChange = e => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0;
    value = clamp(value, 0, maxPeopleAmount);
    setPeopleAmount(value);
  };

  const handleMaxPeopleAmountChange = e => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0;
    value = clamp(value, 0, 10); 
    setMaxPeopleAmount(value);

    if (peopleAmount > value) {
      setPeopleAmount(value);
    }
  };

  const handleBillChange = e => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0;
    setBill(value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const updatedTable = {
      id,
      status,
      peopleAmount,
      maxPeopleAmount,
      bill: status === 'Busy' ? bill : 0,
    };

    dispatch(updateTableRequest(updatedTable));
    navigate('/'); 
  };

  if (!table) return null;

  return (
    <>
      <h1>Table {id}</h1>

      <Form onSubmit={handleSubmit} className="col-12 col-sm-6 col-md-4">
        <Form.Group as={Row} className="mb-3" controlId="status">
          <Form.Label column sm={3}>
            Status:
          </Form.Label>
          <Col sm={9}>
            <Form.Select value={status} onChange={handleStatusChange}>
              <option value="Free">Free</option>
              <option value="Reserved">Reserved</option>
              <option value="Busy">Busy</option>
              <option value="Cleaning">Cleaning</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="people">
          <Form.Label column sm={3}>
            People:
          </Form.Label>
          <Col sm={9} className="d-flex align-items-center">
            <Form.Control
              type="number"
              value={peopleAmount}
              onChange={handlePeopleAmountChange}
              className="me-2"
            />
            <span className="me-2">/</span>
            <Form.Control
              type="number"
              value={maxPeopleAmount}
              onChange={handleMaxPeopleAmountChange}
            />
          </Col>
        </Form.Group>

        {status === 'Busy' && (
          <Form.Group as={Row} className="mb-3" controlId="bill">
            <Form.Label column sm={3}>
              Bill:
            </Form.Label>
            <Col sm={9} className="d-flex align-items-center">
              <span className="me-2">$</span>
              <Form.Control
                type="number"
                value={bill}
                onChange={handleBillChange}
              />
            </Col>
          </Form.Group>
        )}

        <Button type="submit">Update</Button>
      </Form>
    </>
  );
};

export default Table;
