import React, {useState,useEffect} from 'react';
import {Button, Form, Grid, Loader} from 'semantic-ui-react';
import {db} from '../firebase';
import {useParams, useNavigate} from 'react-router-dom'
import { addDoc,updateDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';


const initialState = {
    name: "",
    details:"",
    code: ""

}
const AddEditPromo = () => {
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const {name,details,code} = data;
  const navigate = useNavigate();
  const {id} = useParams();
  

  useEffect(() => {
    id && getSingleUser();
  }, [id])

  const getSingleUser = async () => {
    //promotions is the collection name within firebase 
    const docRef = doc(db, "promotions", id);
    const snapshot = await getDoc(docRef);
    if(snapshot.exists()) {
      setData({...snapshot.data()});
    }
  };

const handleChange = (e) => {
  setData({...data, [e.target.name]: e.target.value})
};

const validate = () => {
  let errors = {};
  if(!name){
    errors.name = "Name is required";
  }
if(!details){
    errors.details = "Details are required";
  }
  if(!code){
    errors.code = "Code is required";
  }
  return errors;
};

const handleSubmit = async (e) => {

  e.preventDefault();
  let errors = validate();
  if(Object.keys(errors).length) return setErrors(errors);
  setIsSubmit(true);
  if(window.confirm("Are you sure you want to add this promotion?")) {
    if(!id){
    try{
      await addDoc(collection(db, "promotions"),{
        ...data,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
    }
  }else{
    try{
      await updateDoc(doc(db, "promotions",id),{
        ...data,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
    }
  }
}

    //after creating a new promo, navigate to the home page
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
                <h2>{id ? "Update Promo details" : "Add Promotion"}</h2>
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
                  label = "Details"
                  error={errors.details ? {content:errors.details} : null}
                  placeholder = "Enter Details"
                  name = "details"
                  onChange={handleChange}
                  value = {details}
                  />
                  <Form.Input 
                  label = "Code"
                  error={errors.details ? {content:errors.details} : null}
                  placeholder = "Enter a Promo Code"
                  name = "code"
                  onChange={handleChange}
                  value = {code}
                  />

                  <Button primary 
                  type = "submit" 
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

export default AddEditPromo