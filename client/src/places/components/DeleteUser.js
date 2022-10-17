import React, { useState, useContext, useEffect } from 'react';
import { useHistory, useParams  } from "react-router-dom";
import Button from '../../shared/components/button/Button';

import Modal from '../../shared/components/modal/Modal';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/modal/ErrorModal';
import LoadingSpinner from '../../shared/components/loadingspinner/LoadingSpinner';
import { useForm } from "../../shared/hooks/form-hook";

import './DeleteUser.css';

const DeleteUser = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().uid;
  const [loadedUser, setLoadedUser] = useState();

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);



  const showConfirmationHandler = () => setShowConfirmationModal(true);
  const cancelConfirmationHandler = () => setShowConfirmationModal(false);

  const history = useHistory();

  const routeChange = () => {
    let path = `/`;
    history.push(path);
  };

  const [setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        //console.log(userId);
        const repsponse = await sendRequest(
          //`http://localhost:5000/api/users/${userId}`
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`
        );

        setLoadedUser(repsponse.user);
        //console.log(repsponse.user);

        setFormData(
          {
            name: {
              value: repsponse.user.name,
              isValid: true,
            },
            password: {
              value: repsponse.user.password,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, userId, setFormData]);

  const deleteConfirmedHandler = async () => {
    setShowConfirmationModal(false);
    try {
      await sendRequest(
        //`http://localhost:5000/api/users/${userId}/delete`,
        `${process.env.REACT_APP_BACKEND_URL}/users/${userId}/delete`,
        "DELETE",
        null, // No body
        { Authorization: "Bearer " + auth.token }
      );

      props.onDelete(props.id);



    } catch (err) {}


    if (auth.role !== "admin") {





      auth.logout();
    } else if (auth.role === "admin") {
      routeChange();
    }

  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedUser && !error) {
    return (
      <div className="center">
        <h2>Could not find user!</h2>
      </div>
    );
  }

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

        <div className="place-item__actionss">
          {auth.isLoggedIn && (
            <Button danger onClick={showConfirmationHandler}>
              Delete
            </Button>
          )}
        </div>
      </li>
    </React.Fragment>
  );
};

export default DeleteUser;





