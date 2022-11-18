import React, {useEffect, useState} from 'react';
import {db} from '../firebase';
import {Button, Card, Grid,Container, Image} from 'semantic-ui-react';
import {useNavigate} from 'react-router-dom';
import { collection, deleteDoc, onSnapshot, doc } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import ModalComp from '../components/ModalComp';



const Home = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    //the collection db, "users" calls upon a database named users in the firebase setup
    const unsub = onSnapshot(collection(db,"users"), (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({id: doc.id, ...doc.data()})
      });
      setUsers(list);
      setLoading(false)

    }, (error)=> {
      console.log(error);
    });
    return () => {
      unsub();
    };
  }, []);

  if(loading) {
    return <Spinner />;
  }

  const handleModal = (item) => {
    setOpen(true);
    setUser(item);
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete?")) {
      try {
        setOpen(false);
        await deleteDoc(doc(db, "users",id));
        setUsers(users.filter((user) => user.id !== id));
      } catch (err) {
        console.log(err)
      }
    }
  }
  const current = new Date();
  const date = `${current.getMonth()+1}/${current.getDate()}/${current.getFullYear()}`;


  return (
    <Container>
      <Container>
      <h3>Promotions</h3>
      <Grid columns = {1} stackable>
        <Card>
          <Card.Content>
            <Card.Header>
              Hello World
            </Card.Header>
          </Card.Content>
        </Card>
      </Grid>
    </Container>
      <h5>Today's Date is {date}</h5>
      <h2>Current Movies</h2>

        <Grid  columns={3} stackable>
          {users && users.map((item) => (
            <Grid.Column key = {item.id}>
              <Card >
                <Card.Content>
                  <Image 
                  src = {item.img}
                  size = "medium"
                  style = {{
                    height: "250px",
                    width: "200px",
                  }}
                  />
                  <Card.Header style={{marginTop: "10px"}} >
                    {item.name}
                    </Card.Header>
                    <Card.Description>Rating: {item.rating}</Card.Description>
                    <Card.Description>{item.genre}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div>
                    <Button 
                    color = "green" 
                    onClick = {()=>navigate(`/update/${item.id}`)}
                    >
                      Update
                    </Button>
                    <Button 
                    color = "orange" 
                    onClick = {()=>handleModal(item)}
                    >
                      View
                    </Button>
                    {open && (
                      <ModalComp 
                      open = {open}
                      setOpen = {setOpen}
                      handleDelete = {handleDelete}
                      {...user}

                      />
                    )}
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>
          ))}
        </Grid>
        <h2>Upcoming Movies</h2>

    </Container>
  )
};

export default Home;