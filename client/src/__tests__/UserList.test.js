import React from 'react'
import {render, screen} from '@testing-library/react'
import UsersList from '../users/components/UsersList'
import { BrowserRouter } from 'react-router-dom';

const DUMMY_USERS = [
  {
    id: "user1",
    name: "John Smith",
    image:
      "https://media.istockphoto.com/photos/fi/brasilialainen-liikemies-laskee-brasilian-valuuttaa-todellinen-id972220800?k=20&m=972220800&s=612x612&w=0&h=9jPF7yuby2yyDletsCfRzlmvKVOV7D5-3oyg6y40qII=",
    
  },
  {
    id: "user2",
    name: "Alex Jones",
    image:
      "https://media.istockphoto.com/photos/fi/komea-mies-ulkona-muotokuva-id1320660496?k=20&m=1320660496&s=612x612&w=0&h=wYUxkRkSiSV2lE8zEa679FD4v51I1FVW2wx5F_1ZNpQ=",

  },
];

describe('User list', () => {
    it('should show true as truthy', () => {
        expect(true).toBe(true)
    })

    it("should show false as falsy", () => {
      expect(false).toBe(false);
    });

    it("should show No users found when the item array is empty", () => {
      render(<UsersList items={[]}/>)
      //screen.debug()
      expect(screen.getByText('No users found.')).toBeInTheDocument()
    });

    it("should show a list of users", () => {
      render(
        <BrowserRouter>
          <UsersList items={DUMMY_USERS} />
        </BrowserRouter>
      );
      //screen.debug()
      expect(screen.queryByText("No users found.")).toBeNull();
      expect(screen.getByText('John Smith')).toBeInTheDocument();

      expect(screen.getByText("Alex Jones")).toBeInTheDocument();

    });
})