import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../../shared/components/avatar/Avatar'
import Card from '../../shared/components/card/Card'

import './UserItem.css';
///users/${auth.userId} <Link to={`/${props.id}/delete`}>
const UserItem = props => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/users/${props.id}/delete`}>
          <div className="user-item__image">
            <Avatar image={props.image} alt={props.name} />
          </div>
          <div className='user-item__info'>
            <h2>{props.name}</h2>
          </div>
        </Link>
      </Card>
    </li>
  )
}

export default UserItem;

