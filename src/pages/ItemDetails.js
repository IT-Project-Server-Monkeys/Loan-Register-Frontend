import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../styles/ItemPage.scss'
import { LoanForm, TextButton, Loading } from '../components';
import { MdEdit } from 'react-icons/md';
import axios from "axios";

const ItemDetails = (props) => {
  const itemId = useParams().id;
  const [item, setItem] = useState({
    being_loaned: false,
    item_name: <Loading />,
    category: <Loading />,
    description: <Loading />
  });

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [loanee, setLoanee] = useState("");
  const [suggestedLoanees, setSuggestedLoanees] = useState(["placeholder", "loanee", "suggestions"]);
  const selectLoanee = (ln) => setLoanee(ln);
  const deleteLoanee = (ln) => setSuggestedLoanees((prev) => prev.filter((lns) => lns !== ln));
  const changeLoanee = (e) => setLoanee(e.target.value);

  // get and show item data
  useEffect(() => {
    const fetchItem = async () => {
      let fetchedData = null;

      await axios.get(
        `https://server-monkeys-backend-test.herokuapp.com/testingItem?id=${itemId}`
        )
        .then((res) => fetchedData = res.data)
        .catch((err) => console.log(err));
  
        if (fetchedData != null) setItem({
          ...fetchedData,
          loanee: <Loading />,
          loan_start_date: <Loading />,
          intended_return_date: <Loading />
        });
        else setItem({}); // show img TODO
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
        loan_start_date: new Date(Date.parse(fetchedData.loan_start_date)).toLocaleDateString(),
        intended_return_date: new Date(Date.parse(fetchedData.intended_return_date)).toLocaleDateString()
      }});
    }
    if (item.being_loaned) fetchLoan();
  }, [itemId, item.being_loaned])

  const saveLoan = (formData) => {

    // TODO post
    let loanData = {loaner_id: props.loginSession.userId};
    if (item.loan_id !== null) loanData._id = item.loan_id;
    if (formData.loanee !== "") loanData.loanee_name = formData.loanee;
    if (formData.loan_start_date !== "") loanData.loan_start_date = formData.loan_start_date;
    if (formData.intended_return_date !== "") loanData.intended_return_date = formData.intended_return_date;
    console.log(loanData);
    console.log("TODO save loan");
  }

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
          <TextButton style={{lineHeight: "1.2"}}>{"Mark\nReturn"}</TextButton>
        </> :
          <TextButton onClick={toggle}>Loan Item</TextButton>
        }
      </div>

      <LoanForm modal={modal} toggle={toggle} item={item}
        newLoan={!item.being_loaned} loaneeValue={loanee}
        onSubmit={saveLoan} suggestedLoanees={suggestedLoanees}
        selectLoanee={selectLoanee} deleteLoanee={deleteLoanee} changeLoanee={changeLoanee}
      />

    </div>
  );
};

export default ItemDetails;
