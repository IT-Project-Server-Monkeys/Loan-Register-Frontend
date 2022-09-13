import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import '../styles/ItemPage.scss'
import { LoanForm, TextButton, Loading, Submitting } from '../components';
import { MdEdit } from 'react-icons/md';
import { fetchItem } from "../utils/itemHelpers";
import { createLoan, editLoan, returnLoan } from "../utils/loanHelpers";
import dateFormat from 'dateformat';

const ItemDetails = (props) => {
  const redirect = useNavigate();
  const itemId = useParams().id;
  const baseItem = {
    item_name: <Loading />, category: <Loading />, description: <Loading />,
    being_loaned: false, loanee_name: <Loading />,
    loan_start_date: <Loading />, intended_return_date: <Loading />
  }
  const [item, setItem] = useState(baseItem);
  const [modal, setModal] = useState(false);

  const [loanee_name, setLoaneeName] = useState("");
  const [suggestedLoanees, setSuggestedLoanees] = useState(["test", "loanee", "suggestions"]);

  const [loanDate, setLoanDate] = useState();
  const [returnDate, setReturnDate] = useState();
  const [submitting, setSubmitting] = useState(false);

  const location = useLocation();
  const itemDetails = location.state ? location.state.item : null;

  const toggle = () => {
    setModal(!modal);
    if (item.being_loaned) {
      setLoaneeName(item.loanee_name);
      setLoanDate(item.loan_start_date);
      setReturnDate(item.intended_return_date);
    } else {
      setLoaneeName("");
      setLoanDate(new Date().toLocaleDateString());
      setReturnDate("");
    }
  };

  const selectLoanee = (ln) => setLoaneeName(ln);
  const deleteLoanee = (ln) => setSuggestedLoanees((prev) => prev.filter((lns) => lns !== ln));
  const changeLoanee = (e) => setLoaneeName(e.target.value);

  const handleCrtLn = async (input) => {
    setSubmitting(true);
    await createLoan({
      ...input,
      item_id: itemId,
      loaner_id: props.uid
    })
    // window.location.reload();
  };
  const handleEdtLn = async (input) => {
    setSubmitting(true);
    await editLoan({ _id: item.loan_id, ...input });
    window.location.reload();
  }
  const handleRtnLn = async () => {
    setSubmitting(true);
    await returnLoan(item);
    window.location.reload();
  }

  useEffect(() => setSubmitting(false), []);
  
  // get and show item data, if not already provided
  useEffect(() => {
    if (itemDetails === null) fetchItem(itemId, setItem)
    else setItem({
      ...itemDetails,
      loan_start_date: dateFormat(itemDetails.loan_start_date, 'dd/mm/yyyy'),
      intended_return_date: dateFormat(itemDetails.intended_return_date, 'dd/mm/yyyy'),
    });
    // TODO clear itemdetails
    window.history.replaceState({}, document.title);
  }, [itemId, itemDetails]);

  useEffect(() => {
  }, [item]);

  useEffect (() => {
    if (item.item_owner == null) return;
    if (props.uid == null || props.uid !== item.item_owner) {
      // TODO show that user does not have permission to view item
      if (props.uid == null) redirect("/login");
      else redirect("/dashboard/loaner");
      return;
    }

  }, [item, props.uid, redirect])

  return (
    <div className={"item-page"}>

      <Link to={`/item-details/${itemId}/edit`} state={{item: item}}>
        <button className={"edit-item icon-blue"}><MdEdit size={40} /></button>
      </Link>
      
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
                <td>Loanee:</td><td>{item.loanee_name}</td>
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
        newLoan={!item.being_loaned} loaneeValue={loanee_name}
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
