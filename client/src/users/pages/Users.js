import React, {useEffect, useState, useContext} from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/modal/ErrorModal';
import LoadingSpinner from '../../shared/components/loadingspinner/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from "../../shared/context/auth-context";
const Users = () => {
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [userData, setUserData] = useState()
  const auth = useContext(AuthContext);

  useEffect(()=> {
    const fetchUsers = async () => {
      try {
        const users = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users/');
        setUserData(users);
        //console.log(users)
      } catch (err) {}
    }
    fetchUsers();
  }, [sendRequest]); //We can add it as dependency because useCallback will prevent a loop

  return (
    <React.Fragment>

      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && userData && auth.isLoggedIn && auth.role === "admin" && <UsersList items={userData.users} />}
    </React.Fragment>
  );
}

export default Users;
