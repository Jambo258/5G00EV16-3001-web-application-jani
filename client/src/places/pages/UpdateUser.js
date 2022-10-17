import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/input/Input';
import Button from '../../shared/components/button/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/modal/ErrorModal';
import LoadingSpinner from '../../shared/components/loadingspinner/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';

import './PlaceForm.css';
//import PlaceItem from '../components/PlaceItem';

const UpdateUser = () => {
  const auth = useContext(AuthContext);
  const [loadedUser, setLoadedUser] = useState();
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const userId = useParams().uid;

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
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
        //console.log(repsponse.user)

        setFormData(
          {
            name: {
              value: repsponse.user.name,
              isValid: true
            },
            password: {
              value: repsponse.user.password,
              isValid: true
            }
          },
          true
        );
      } catch (err) {}
    }
    fetchUser();
  },[sendRequest, userId, setFormData]);

  const history = useHistory();

  const userUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {

      await sendRequest(
        //`http://localhost:5000/api/users/${userId}`,
        `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
        "PATCH",
        JSON.stringify({
          name: formState.inputs.name.value,
          password: formState.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      // /users/:uid
      history.push("/users/" + auth.userId);
    } catch (err) {}
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
       {!isLoading && loadedUser && <form className="place-form" onSubmit={userUpdateSubmitHandler}>
        <Input
          id="name"
          element="input"
          type="text"
          label="New Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter new name."
          onInput={inputHandler}

          initialValid={true}
        />
        <Input
          id="password"
          element="input"
          label="New Password"
          type="password"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a new password."
          onInput={inputHandler}

          initialValid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>
          Update details
        </Button>

      </form>}
    </React.Fragment>
  );
};

export default UpdateUser;

