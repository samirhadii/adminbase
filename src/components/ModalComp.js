import React from 'react';
import {Modal,Header,Image, Button} from "semantic-ui-react";
import YoutubeEmbed from './YoutubeEmbed';


const ModalComp = ({open, setOpen, img, name, info,genre,rating,datetime,youtubelink,id,handleDelete}) => {
  return (
    <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open = {open} >
        <Modal.Header>Movie Details</Modal.Header>
        <Modal.Content image>
            <Image size = "medium" src = {img} wrapped/>
            
            <Modal.Description>
                <Header>{name}</Header> 
                <YoutubeEmbed embedId={youtubelink.slice(17)} />
                <p>Genre: {genre}</p>
                <p>Rating: {rating}</p>
                <p>Date: {datetime}</p>
                <p>{info}</p>
                <p>Trailer Link: {youtubelink}</p>
               

            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
        <Button 
            color = "black" 
            onClick = {()=>setOpen(false)}>
                Cancel
            </Button>
            <Button color = "red" content = "Delete" labelPosition='right' icon= "checkmark" onClick={()=> handleDelete(id)}/>
        </Modal.Actions>
    </Modal>
  );
}

export default ModalComp