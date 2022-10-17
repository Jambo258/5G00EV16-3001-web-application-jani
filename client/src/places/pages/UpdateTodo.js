import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/input/Input";
import Button from "../../shared/components/button/Button";
import {
  VALIDATOR_REQUIRE,
  //VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/modal/ErrorModal";
import LoadingSpinner from "../../shared/components/loadingspinner/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";

import "./PlaceForm.css";

const UpdateTodo = () => {
  const auth = useContext(AuthContext);
  const [loadedTodo, setLoadedTodo] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const todoId = useParams().tid;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const repsponse = await sendRequest(
          //`http://localhost:5000/api/todos/${todoId}`
          `${process.env.REACT_APP_BACKEND_URL}/todos/${todoId}`
        );
        setLoadedTodo(repsponse.todo);
        //console.log(repsponse.todo)
        setFormData(
          {
            title: {
              value: repsponse.todo.title,
              isValid: true,
            },

          },
          true
        );
      } catch (err) {}
    };
    fetchTodo();
  }, [sendRequest, todoId, setFormData]);

  const history = useHistory();

  const todoUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        //`http://localhost:5000/api/todos/${todoId}`,
        `${process.env.REACT_APP_BACKEND_URL}/todos/${todoId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,

        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/" + auth.userId + "/todos");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedTodo && !error) {
    return (
      <div className="center">
        <h2>Could not find todo!</h2>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedTodo && (
        <form className="place-form" onSubmit={todoUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Todo"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid todo."
            onInput={inputHandler}
            initialValue={loadedTodo.title}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update todo
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateTodo;
