import React from "react";
import { render, screen } from "@testing-library/react";
import UserItem from "../users/components/UserItem";
import { BrowserRouter } from "react-router-dom";

describe('User item', () => {
    const DUMMY_USER = {
      id: "user2",
      name: "Alex Jones",
      image:
        "https://media.istockphoto.com/photos/fi/komea-mies-ulkona-muotokuva-id1320660496?k=20&m=1320660496&s=612x612&w=0&h=wYUxkRkSiSV2lE8zEa679FD4v51I1FVW2wx5F_1ZNpQ=",

    };

    it ('should show the user details', () => {
        render(
          <BrowserRouter>
            <UserItem key={'key_1'}
            id={DUMMY_USER.id}
            image={DUMMY_USER.image}
            name={DUMMY_USER.name}

            />
          </BrowserRouter>
        );
        //screen.debug()
        expect(screen.getByText('Alex Jones')).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
        expect(screen.getByAltText('Alex Jones')).toBeInTheDocument();
        expect(screen.getByRole('listitem')).toHaveClass('user-item');
        expect(screen.getByRole('link')).toHaveAttribute('href','/users/user2/delete')
    })
})
