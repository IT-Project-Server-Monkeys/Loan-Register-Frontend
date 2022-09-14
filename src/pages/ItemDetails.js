import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import '../styles/ItemPage.scss'
import { LoanForm, TextButton, Loading, Submitting, NoAccess } from '../components';
import { MdEdit } from 'react-icons/md';
import { fetchItem } from "../utils/itemHelpers";
import { createLoan, editLoan, returnLoan } from "../utils/loanHelpers";
import { noAccessRedirect } from "../utils/helpers";

const ItemDetails = (props) => {
  const redirect = useNavigate();
  const itemId = useParams().id;
  const [item, setItem] = useState({
    being_loaned: false, item_name: <Loading />,
    category: <Loading />, description: <Loading />,
    loanee_name: <Loading />, loan_start_date: <Loading />, intended_return_date: <Loading />,
  });
  const [modal, setModal] = useState(false);

  const [loaneeName, setLoaneeName] = useState("");
  const [suggestedLoanees, setSuggestedLoanees] = useState(["test", "loanee", "suggestions"]);

  const [loanDate, setLoanDate] = useState();
  const [returnDate, setReturnDate] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [noAccess, setNoAccess] = useState(false);

  const location = useLocation()
  const itemDetails = location.state ? location.state.item : null;

  console.log('itemDetails', itemDetails)

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
    }, () => {
      redirect(`/item-details/${itemId}`, {state: null});
      window.location.reload();
    })
  };
  const handleEdtLn = async (input) => {
    setSubmitting(true);
    await editLoan({ _id: item.loan_id, ...input }, () => {
      redirect(`/item-details/${itemId}`, {state: null});
      window.location.reload();
    })
  }
  const handleRtnLn = async () => {
    setSubmitting(true);
    console.log(item);
    await returnLoan(item, () => {
      redirect(`/item-details/${itemId}`, {state: null});
      window.location.reload();
    })
  }

  useEffect(() => setSubmitting(false), []);

  // get and show item data
  useEffect(() => {
    if (itemDetails === null) fetchItem(itemId, setItem);
    else setItem(itemDetails);
  }, [itemId, itemDetails]);

  useEffect (() => {
    if (item.item_owner == null) return;
    if (props.uid == null || props.uid !== item.item_owner) {

      noAccessRedirect(props.uid == null ? "/login" : "/dashboard/loaner",
        redirect, setNoAccess);

      return;
    }

    if (item.being_loaned) {
      setLoaneeName(item.loanee_name);
      setLoanDate(item.loan_start_date);
      setReturnDate(item.intended_return_date);
    } else {
      setLoaneeName("");
      setLoanDate(new Date().toLocaleDateString());
      setReturnDate("");
    }
  }, [item, props.uid, redirect])

  return (
    <>
      <div className={"item-page"} style={noAccess ? {display: "none"} : null}>

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
            <p>Description:<br />{item.description !== "" ? item.description : "(No description.)"}</p>
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
          newLoan={!item.being_loaned} loaneeValue={loaneeName}
          onSubmit={item.being_loaned ? handleEdtLn : handleCrtLn}
          suggestedLoanees={suggestedLoanees} changeLoanee={changeLoanee}
          selectLoanee={selectLoanee} deleteLoanee={deleteLoanee}
          lnDateValue={loanDate} rtnDateValue={returnDate}
          chgLnDate={(d) => setLoanDate(d)} chgRtnDate={(d) => setReturnDate(d)}
        />
        
        <Submitting style={submitting ? {display: "flex"} : {display: "none"}} />
      </div>
      <NoAccess style={noAccess ? {display: "flex"} : {display: "none"}} />
    </>
  );
};

export default ItemDetails;
