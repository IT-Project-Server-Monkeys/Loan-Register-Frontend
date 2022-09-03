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

  const saveLoan = async (input) => {
    // initialise form
    let formData = {
      loaner_id: props.loginSession.userId,
      item_id: itemId, status: input.status
    };
    if (item.loan_id !== null) formData._id = item.loan_id;

    // add optional fields
    if (input.loanee_id !== "" && input.loanee_id !== null)
      formData.loanee_id = input.loanee_id;
    if (input.loan_start_date !== "" && input.loan_start_date !== null)
      formData.loan_start_date = input.loan_start_date;
    if (input.intended_return_date !== "" && input.intended_return_date !== null)
      formData.intended_return_date = input.intended_return_date;
    if (input.actual_return_date !== "" && input.actual_return_date !== null)
      formData.actual_return_date = input.actual_return_date;
    if (input.status !== "" && input.status !== null) formData.status = input.status;

    console.log(formData);
    await axios({
      method: item.being_loaned ? "put" : "post", data: formData,
      url: "https://server-monkeys-backend-test.herokuapp.com/testingLoan",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    window.location.reload();
  }

  const returnLoan = async () => {
    const actual_return_date = new Date();
    const dateDiff = actual_return_date - new Date(Date.parse(item.intended_return_date));

    let loanFormData = { _id: item.loan_id, actual_return_date: actual_return_date };
    if (dateDiff > 0) saveLoan({...loanFormData, status: "Late Return"});
    else if (dateDiff > -86400000) saveLoan({...loanFormData, status: "On Time Return"});
    else saveLoan({...loanFormData, status: "Early Return"});
  }

  const createLoan = async (input) => {
    let loanFormData = { status: "Current", ...input};
    if (input.loan_start_date === null || input.loan_start_date === "")
      loanFormData.loan_start_date = new Date();
    saveLoan(loanFormData);
  }

  const editLoan = (input) => {
    let loanFormData = { status: "Current" };
    if (input.loanee_id !== null) loanFormData.loanee_id = input.loanee_id;
    if (input.loan_start_date !== null) loanFormData.loan_start_date = input.loan_start_date;
    if (input.intended_return_date !== null) loanFormData.intended_return_date = input.intended_return_date;
    saveLoan(loanFormData);
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
          <TextButton onClick={returnLoan} style={{lineHeight: "1.2"}}>{"Mark\nReturn"}</TextButton>
        </> :
          <TextButton onClick={toggle}>Loan Item</TextButton>
        }
      </div>

      <LoanForm modal={modal} toggle={toggle} item={item}
        newLoan={!item.being_loaned} loaneeValue={loanee}
        onSubmit={item.being_loaned ? editLoan : createLoan}
        suggestedLoanees={suggestedLoanees} changeLoanee={changeLoanee}
        selectLoanee={selectLoanee} deleteLoanee={deleteLoanee}
      />

    </div>
  );
};

export default ItemDetails;
