import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../styles/ItemPage.scss'
import { TextButton } from '../components';
import { MdEdit } from 'react-icons/md';
import axios from "axios";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


// temporary data. TODO get real data from server
const tempItem = {
  "_id": {
      "$oid": "63084e1ebb2f12d6134fe1a4"
  },
  "item_name": "failed retrieval",
  "category": "uwu",
  "description": "fake data.",
  "item_owner": {
      "$oid": "62fd8a9df04410afbc6df31d"
  },
  "being_loaned": true,
  "loan_frequency": {
      "$numberInt": "0"
  }
}

const ItemDetails = () => {
  const itemId = useParams().id;
  const [item, setItem] = useState({being_loaned: false});

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  // get and show item data
  useEffect(() => {
    const fetchItem = async () => {
      let fetchedData = null;
  
      await axios.get(
        `https://server-monkeys-backend-test.herokuapp.com/testingItem?id=${itemId}`
        )
        .then((res) => fetchedData = res.data)
        .catch((err) => console.log(err));
  
        if (fetchedData != null) setItem(fetchedData);
        else setItem(tempItem); // show img TODO
    }
    fetchItem();
  }, [itemId]);

  // get and shows loan information
  useEffect (() => {
    const fetchLoan = async () => {
      let fetchedData = null;
      let loaneeName = "";

      await axios.get(`https://server-monkeys-backend-test.herokuapp.com/testingLoan?item_id=${itemId}&status=current`)
        .then((res) => fetchedData = res.data[0])
        .catch((err) => console.log(err));

      await axios.get(`https://server-monkeys-backend-test.herokuapp.com/testingUser?id=${fetchedData.loanee_id}`)
        .then((res) => loaneeName = res.data[0].display_name)
        .catch(err => console.log(err))

      setItem((initItem) => {return {
        ...initItem,
        loan_id: fetchedData._id,
        loanee: loaneeName,
        loan_start_date: fetchedData.loan_start_date.substring(0, 10),
        intended_return_date: fetchedData.intended_return_date.substring(0, 10)
      }});
    }
    if (item.being_loaned) fetchLoan();
  }, [itemId, item.being_loaned])

  return (
    <div className={"item-page"}>

      <a href={`/item-details/${itemId}/edit`}><button className={"edit-item icon-blue"}>
        <MdEdit size={40} />
      </button></a>
      
      <div className={"item-details"}>

        <div className={"item-image"} style={{backgroundImage: "url('https://picsum.photos/400/400')" }} />
        
        <p className={"item-status"}>Status: {item.being_loaned ? "On Loan" : "Available"}</p>
        <div className={"item-info"}>
          <table><tbody>
            <tr>
              <td>Name:</td><td>{item.item_name}</td>
            </tr>
            <tr>
              <td>Category:</td><td>{item.category}</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
            </tr>
            { item.being_loaned ? <>
              <tr>
                <td>Loanee:</td><td>{item.loanee}</td>
              </tr>
              <tr>
                <td>Date loaned:</td><td>{item.loan_start_date}</td>
              </tr>
              <tr>
                <td>Expected return:</td><td>{item.intended_return_date}</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
              </tr>
            </> : null}
            </tbody></table>
          <p>Description:<br />{item.description}</p>
        </div>
      </div>

      <div className={"btn-list"}>
        <a href="/history"><TextButton>History</TextButton></a>
        {item.being_loaned ? <>
          <TextButton onClick={toggle}>Edit Loan</TextButton>
          <TextButton>Mark Return</TextButton>
        </> :
          <TextButton onClick={toggle}>Loan Item</TextButton>
        }
      </div>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </ModalBody>
        <ModalFooter className={"btn-list"}>
          <TextButton onClick={toggle}>
            Confirm
          </TextButton>
          <TextButton altStyle onClick={toggle}>
            Cancel
          </TextButton>
        </ModalFooter>
      </Modal>

    </div>
  );
};

export default ItemDetails;
