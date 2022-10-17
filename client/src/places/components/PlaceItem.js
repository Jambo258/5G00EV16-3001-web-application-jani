import React, { useState, useContext } from "react";

import Button from "../../shared/components/button/Button";
import Card from "../../shared/components/card/Card";

import Modal from "../../shared/components/modal/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/modal/ErrorModal";
import LoadingSpinner from "../../shared/components/loadingspinner/LoadingSpinner";

import "./PlaceItem.css";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();


  const [showConfirmationModal, setShowConfirmationModal] = useState(false);


  const showConfirmationHandler = () => setShowConfirmationModal(true);
  const cancelConfirmationHandler = () => setShowConfirmationModal(false);

  const deleteConfirmedHandler = async () => {
    setShowConfirmationModal(false);
    try {
      await sendRequest(
        //`http://localhost:5000/api/todos/${props.id}`,
        `${process.env.REACT_APP_BACKEND_URL}/todos/${props.id}`,
        "DELETE",
        null, // No body
        { Authorization: "Bearer " + auth.token }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <Modal
        show={showConfirmationModal}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelConfirmationHandler}>
              Cancel
            </Button>
            <Button delete onClick={deleteConfirmedHandler}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>Are you sure? Once it's gone, it's gone!</p>
      </Modal>
      <li className="place-item">
        {isLoading && <LoadingSpinner asOverlay />}
        <Card className="place-item__content">

          <div className="place-item__info">
            <h2>{props.title}</h2>
          </div>
          <div className="place-item__actions">

            {auth.isLoggedIn && (
              <Button to={`/todos/${props.id}`}>Edit</Button>
            )}
            {auth.isLoggedIn && (
              <Button danger onClick={showConfirmationHandler}>
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
