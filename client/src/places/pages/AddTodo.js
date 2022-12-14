
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/input/Input';
import Button from '../../shared/components/button/Button';
import {
  VALIDATOR_REQUIRE,
  //VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/modal/ErrorModal';
import LoadingSpinner from '../../shared/components/loadingspinner/LoadingSpinner';

import './PlaceForm.css';

const NewTodo = () => {
  const auth = useContext(AuthContext);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
    },
    false
  );

  const history = useHistory();

  const todoSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        //"http://localhost:5000/api/todos/",
        process.env.REACT_APP_BACKEND_URL + '/todos',
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          creator: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push('/');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={todoSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Todo"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid todo."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          Add todo
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewTodo;
