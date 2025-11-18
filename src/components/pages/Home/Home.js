import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import {
  getAllTables,
  getTablesRequest,
  fetchTables,
} from '../../../redux/tablesRedux';

const Home = () => {
  const dispatch = useDispatch();
  const tables = useSelector(getAllTables);
  const request = useSelector(getTablesRequest);

  useEffect(() => {
    if (!tables.length) {
      dispatch(fetchTables());
    }
  }, [dispatch, tables.length]);

  return (
    <>
      <h1>All tables</h1>

      {!request || request.pending ? (
        <p>
          <Spinner animation="border" size="sm" /> Loading...
        </p>
      ) : request.error ? (
        <p className="text-danger">Error while loading tables.</p>
      ) : (
        tables.map(table => (
          <div
            key={table.id}
            className="d-flex justify-content-between align-items-center border-bottom py-3"
          >
            <div>
              <strong>Table {table.id}</strong>
              <span className="ms-3">
                <strong>Status:</strong> {table.status}
              </span>
            </div>

            <Button as={Link} to={`/table/${table.id}`} variant="primary">
              Show more
            </Button>
          </div>
        ))
      )}
    </>
  );
};

export default Home;
