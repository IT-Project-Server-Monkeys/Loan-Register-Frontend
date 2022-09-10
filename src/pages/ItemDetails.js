import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../styles/ItemPage.scss'
import { LoanForm, TextButton, Loading, Submitting } from '../components';
import { MdEdit } from 'react-icons/md';
import { fetchItem } from "../utils/itemHelpers";
import { fetchLoan, createLoan, editLoan, returnLoan } from "../utils/loanHelpers";

const ItemDetails = (props) => {
  const redirect = useNavigate();
  const itemId = useParams().id;
  const [item, setItem] = useState({
    being_loaned: false, item_name: <Loading />,
    category: <Loading />, description: <Loading />
  });

  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
    if (item.being_loaned) {
      setLoanee(item.loanee);
      setLoanDate(item.loan_start_date);
      setReturnDate(item.intended_return_date);
    } else {
      setLoanee("");
      setLoanDate(new Date().toLocaleDateString());
      setReturnDate("");
    }
  };

  const [loanee, setLoanee] = useState("");
  const [suggestedLoanees, setSuggestedLoanees] = useState(["test", "loanee", "suggestions"]);
  const selectLoanee = (ln) => setLoanee(ln);
  const deleteLoanee = (ln) => setSuggestedLoanees((prev) => prev.filter((lns) => lns !== ln));
  const changeLoanee = (e) => setLoanee(e.target.value);

  const [loanDate, setLoanDate] = useState();
  const [returnDate, setReturnDate] = useState();

  const [submitting, setSubmitting] = useState(false);

  const handleCrtLn = (input) => {
    setSubmitting(true);

    createLoan({
      ...input,
      item_id: itemId,
      loaner_id: props.uid
    })
  };
  const handleEdtLn = (input) => {
    setSubmitting(true);
    editLoan({ _id: item.loan_id, ...input });
  }
  
  const handleRtnLn = () => {
    setSubmitting(true);
    returnLoan(item);
  }

  useEffect(() => setSubmitting(false), []);

  // get and show item data
  useEffect(() => {
    fetchItem(itemId, setItem, {
      loanee: <Loading />,
      loan_start_date: <Loading />,
      intended_return_date: <Loading />
    });
  }, [itemId]);

  // get and shows loan information
  useEffect (() => {
    if (item.being_loaned) fetchLoan(itemId, setItem);
  }, [itemId, item.being_loaned])

  useEffect (() => {
    if (item.item_owner == null) return;
    if (props.uid == null || props.uid !== item.item_owner) {
      // TODO show that user does not have permission to view item
      if (props.uid == null) redirect("/login");
      else redirect("/dashboard/loaner");
      return;
    }

    if (item.being_loaned) {
      setLoanee(item.loanee);
      setLoanDate(item.loan_start_date);
      setReturnDate(item.intended_return_date);
    } else {
      setLoanee("");
      setLoanDate(new Date().toLocaleDateString());
      setReturnDate("");
    }
  }, [item, props.uid, redirect])

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
          <TextButton onClick={handleRtnLn}>{"Mark Return"}</TextButton>
        </> :
          <TextButton onClick={toggle}>Loan Item</TextButton>
        }
      </div>

      <LoanForm modal={modal} toggle={toggle} item={item}
        newLoan={!item.being_loaned} loaneeValue={loanee}
        onSubmit={item.being_loaned ? handleEdtLn : handleCrtLn}
        suggestedLoanees={suggestedLoanees} changeLoanee={changeLoanee}
        selectLoanee={selectLoanee} deleteLoanee={deleteLoanee}
        lnDateValue={loanDate} rtnDateValue={returnDate}
        chgLnDate={(d) => setLoanDate(d)} chgRtnDate={(d) => setReturnDate(d)}
      />
      
      <Submitting style={submitting ? {display: "flex"} : {display: "none"}} />
    </div>
  );
};

export default ItemDetails;
