import React from 'react'
import {Menu, Container, Button, Image} from 'semantic-ui-react';
import {useNavigate, Link} from 'react-router-dom';
import logo from '../asset/logo.png';

const NavBar = () => {
    const navigate  = useNavigate();
  return (
    <Menu inverted borderless style = {{padding: "0.3 rem" , marginBottom: "20px"}} attached color = "grey">
        <Container>
            <Menu.Item name = "home">
                <Link to = "/">
                    <Image size = "mini" src = {logo} alt = "logo"/>
                </Link>

            </Menu.Item>
            <Menu.Item>
                <h2>
                    Movie Admin Portal 
                </h2>
            </Menu.Item>
            <Menu.Item position = "right">
                <Button size = "mini" primary onClick={() => navigate("/addmovie")}>Add Movie</Button>
            </Menu.Item>
            <Menu.Item position = "right: 90%">
                <Button size = "mini" primary onClick={() => navigate("/addpromo")}>Add Promo</Button>
            </Menu.Item>
        </Container>

    </Menu>
  )
}

export default NavBar;