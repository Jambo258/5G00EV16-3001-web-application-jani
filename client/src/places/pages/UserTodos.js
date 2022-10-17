
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import PlacesList from '../components/PlacesList';
import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/modal/ErrorModal';
import LoadingSpinner from '../../shared/components/loadingspinner/LoadingSpinner';

// 'https://visitylojarvi.fi/wp-content/uploads/2016/11/ylojarvi-seitseminen-nuotiopaikka.jpg'

const UserTodos = props => {
  const [loadedTodos, setLoadedTodos] = useState();
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const userId = useParams().uid;

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await sendRequest(
          //`http://localhost:5000/api/todos/user/${userId}`
          `${process.env.REACT_APP_BACKEND_URL}/todos/user/${userId}`
        );
        //console.log(response.todos)
        setLoadedTodos(response.todos);
      } catch (err) {}
    }
    fetchTodos();

  },[sendRequest, userId]);

  const todoDeletedHandler = (deletedTodoId) => {
    setLoadedTodos(prevTodos =>
      prevTodos.filter(todo => todo.id !== deletedTodoId)
    )
  };


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedTodos &&
        <PlacesList items={loadedTodos} onDeletePlace={todoDeletedHandler} />}
    </React.Fragment>
  );
};

export default UserTodos;
