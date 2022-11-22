import React, {useState,useEffect} from 'react';
import {Button, Form, Grid, Loader} from 'semantic-ui-react';
import {storage, db} from '../firebase'
import {useParams, useNavigate} from 'react-router-dom'
import { getDownloadURL, uploadBytesResumable, ref } from 'firebase/storage';
import { addDoc,updateDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';


const initialState = {
  name: "",
  genre:  "",
  info:  "",
  rating:  "",
  datetime: "",
  showtimes: "",
  youtubelink: ""

}
const AddEditMovie = () => {
  const [data, setData] = useState(initialState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const {name,genre,info, rating, datetime,showtimes,youtubelink} = data;
  const navigate = useNavigate();
  const {id} = useParams();
  

  useEffect(() => {
    id && getSingleMovie();
  }, [id])

  const getSingleMovie = async () => {
    //movies is the collection name within firebase 
    const docRef = doc(db, "movies", id);
    const snapshot = await getDoc(docRef);
    if(snapshot.exists()) {
      setData({...snapshot.data()});
    }
  };


  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      console.log(name)
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed", (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        switch(snapshot.state) {
          case "paused":
            console.log("upload is paused");
            break;
          case "running":
            console.log("upload is running");
            break;
          default:
            break;
        }
      }, (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setData((prev) => ({...prev, img: downloadURL}));
        });
      }
      );
    };
    file && uploadFile();
  }, [file]);


const handleChange = (e) => {
  setData({...data, [e.target.name]: e.target.value})
};

const validate = () => {
  let errors = {};
  if(!name){
    errors.name = "Name is required";
  }
  if(!genre){
    errors.genre = "genre is required";
  }
  if(!info){
    errors.info = "Info is required";
  }
  if(!rating){
    errors.rating = "rating is required";
  }
  if(!datetime){
    errors.datetime = "release date is required";
  }
  if(!showtimes){
    errors.showtimes = "showtimes are required";
  }
  return errors;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  let errors = validate();
  if(Object.keys(errors).length) return setErrors(errors);
  setIsSubmit(true);
  if(!id){
    try{
      await addDoc(collection(db, "movies"),{
        ...data,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
    }
  }else{
    try{
      await updateDoc(doc(db, "movies",id),{
        ...data,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
    }
  }

    //after creating a new movie, navigate to the home page
    navigate("/");
};
  return (
    <div>
      <Grid centered verticalAlign='middle' columns = "3" style = {{height: "80 vh"}}>
        <Grid.Row>
          <Grid.Column textAlign='center'>
            <div>
              {isSubmit ?( <Loader active inline = "centered" size = "huge" />): (
                <>
                <h2>{id ? "Update Movie details" : "Add Movie"}</h2>
                <Form onSubmit = {handleSubmit}>
                  <Form.Input 
                  label = "Name"
                  error={errors.name ? {content:errors.name} : null}
                  placeholder = "Enter Name"
                  name = "name"
                  onChange={handleChange}
                  value = {name}
                  autoFocus
                  />
                  <Form.Input 
                  label = "genre"
                  error={errors.genre ? {content:errors.genre} : null}
                  placeholder = "Enter genre"
                  name = "genre"
                  onChange={handleChange}
                  value = {genre}
                  /> 
                  <Form.Input 
                  label = "rating"
                  error={errors.rating ? {content:errors.rating} : null}
                  placeholder = "Enter rating"
                  name = "rating"
                  onChange={handleChange}
                  value = {rating}
                  />
                  <Form.TextArea 
                  label = "Info"
                  error={errors.info ? {content:errors.info} : null}
                  placeholder = "Enter Info"
                  name = "info"
                  onChange={handleChange}
                  value = {info}
                  />
                  <Form.Input
                  label = "Release Date"
                  placeholder = "Enter Release Date here"
                  name = "datetime"
                  onChange={handleChange}
                  value = {datetime}
                  />
                  <Form.Input
                  label = "showtimes"
                  placeholder = "enter your showtimes here"
                  name = "showtimes"
                  onChange={handleChange}
                  value = {showtimes}
                  />
                  <Form.Input
                  label = "Movie Trailer"
                  placeholder = "paste the youtube link here"
                  name = "youtubelink"
                  onChange={handleChange}
                  value = {youtubelink}
                  />



                   <Form.Input 
                  label = "movie poster"
                  type = "file"
                  onChange = {(e) => setFile(e.target.files[0])}
                  />  

                  <Button primary 
                  type = "submit" 
                  disabled = {progress !== null && progress < 100}
                  >
                    Submit
                    </Button>
                </Form>
                </>
              )}
            </div>

          </Grid.Column>
        </Grid.Row>

      </Grid>
    </div>

  )
}

export default AddEditMovie