import React, {useEffect, useState} from 'react';
import {db} from '../firebase';
import {Button, Card, Grid,Container, Image} from 'semantic-ui-react';
import {useNavigate} from 'react-router-dom';
import { collection, deleteDoc, onSnapshot, doc } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import ModalComp from '../components/ModalComp';



const Home = () => {
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const [newopen, setNewOpen] = useState(false);
  const [movie, setMovie] = useState({});
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const[promotions,setPromotions] =useState([]);
  //const [promotion,setPromotion] = useState(false);
  const [newmovies, setNewMovies] = useState([]);
  const [newmovie, setNewMovie] = useState({});

//useeffect for movies
  useEffect(() => {
    setLoading(true);
    //the collection db, "movies" calls upon a database named movies in the firebase setup
    const unsub = onSnapshot(collection(db,"movies"), (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({id: doc.id, ...doc.data()})
      });
      setMovies(list);
      setLoading(false)

    }, (error)=> {
      console.log(error);
    });
    return () => {
      unsub();
    };
  }, []);
  //useEffect for promotions
  useEffect(() => {
    setLoading(true);
    //the collection db, "movies" calls upon a database named movies in the firebase setup
    const promounsub = onSnapshot(collection(db,"promotions"), (snapshot) => {
      let promolist = [];
      snapshot.docs.forEach((doc) => {
        promolist.push({id: doc.id, ...doc.data()})
      });
      setPromotions(promolist);
      setLoading(false)

    }, (error)=> {
      console.log(error);
    });
    return () => {
      promounsub();
    };
  }, []);
  //useEffect for new movies
  useEffect(() => {
    setLoading(true);
    //the collection db, "newmovies" calls upon a database named movies in the firebase setup
    const newunsub = onSnapshot(collection(db,"newmovies"), (snapshot) => {
      let newmovielist = [];
      snapshot.docs.forEach((doc) => {
        newmovielist.push({id: doc.id, ...doc.data()})
      });
      setNewMovies(newmovielist);
      setLoading(false)

    }, (error)=> {
      console.log(error);
    });
    return () => {
      newunsub();
    };
  }, []);

  if(loading) {
    return <Spinner />;
  }

  const handleModal = (item) => {
    setOpen(true);
    setMovie(item);
  };
  //handle new modal for scheduled movies
  const handleNewModal = (newitem) => {
    setNewOpen(true);
    setNewMovie(newitem);
  };
//handle movies delete
  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete?")) {
      try {
        setOpen(false);
        await deleteDoc(doc(db, "movies",id));
        setMovies(movies.filter((movie) => movie.id !== id));
      } catch (err) {
        console.log(err)
      }
    }
  }
  const handlePromoDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this promotion?")) {
      try {
        setOpen(false);
        await deleteDoc(doc(db, "promotions",id));
        setPromotions(promotions.filter((promotion) => promotion.id !== id));
      } catch (err) {
        console.log(err)
      }
    }
  }
  //handle new movie delete
  const handleNewMovieDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete?")) {
      try {
        setOpen(false);
        await deleteDoc(doc(db, "newmovies",id));
        setNewMovies(newmovies.filter((newmovie) => newmovie.id !== id));
      } catch (err) {
        console.log(err)
      }
    }
  }
  const current = new Date();
  const date = `${current.getMonth()+1}/${current.getDate()}/${current.getFullYear()}`;


  return (
    <Container> 
      {/* Grid to separate promos from movies */}
      <Container>
      <h3>Promotions</h3>
      <Grid celled columns = {4} stackable>
        {promotions && promotions.map((item) => (
          <Grid.Column key = {item.id}>
        <Card>
          <Card.Content>
            <Card.Header>
              {item.name}
            </Card.Header>
            <Card.Description>{item.details}</Card.Description>
            <Card.Description>Code: {item.code}</Card.Description>
            <Button 
            color = "blue"
            onClick = {()=>navigate(`/updatepromo/${item.id}`)}

            >
              Update 
            </Button>
            <Button 
            color = "red"
            onClick = {()=>handlePromoDelete(item.id)}>
              Delete
            </Button>
          </Card.Content>
        </Card>
      </Grid.Column>
      ))}
      </Grid>
    </Container>
      <h5>Today's Date is {date}</h5>
      <h2>Current Movies</h2>
        <Grid  columns={3} stackable>
          {movies && movies.map((item) => (
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
                    onClick = {()=>navigate(`/updatemovie/${item.id}`)}
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
                      {...movie}

                      />
                    )}
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>
          ))}
        </Grid>
        <h2>Upcoming Movies</h2>
        <Grid  columns={3} stackable>
          {newmovies && newmovies.map((newitem) => (
            <Grid.Column key = {newitem.id}>
              <Card >
                <Card.Content>
                  <Image 
                  src = {newitem.img}
                  size = "medium"
                  style = {{
                    height: "250px",
                    width: "200px",
                  }}
                  />
                  <Card.Header style={{marginTop: "10px"}} >
                    {newitem.name}
                    </Card.Header>
                    <Card.Description>Rating: {newitem.rating}</Card.Description>
                    <Card.Description>{newitem.genre}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div>
                    <Button 
                    color = "green" 
                    onClick = {()=>navigate(`/updateschedule/${newitem.id}`)}
                    >
                      Update
                    </Button>
                    <Button 
                    color = "orange" 
                    onClick = {()=>handleNewModal(newitem)}
                    >
                      View
                    </Button>
                    {newopen && (
                      <ModalComp 
                      newopen = {newopen}
                      setNewOpen = {setNewOpen}
                      handleNewMovieDelete = {handleNewMovieDelete}
                      {...newmovie}

                      />
                    )}
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>
          ))}
        </Grid>
      
    </Container>
  )
};

export default Home;