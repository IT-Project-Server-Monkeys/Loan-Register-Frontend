import React, { useState } from "react";
import "../styles/InputDropdown.scss"; // component scoped style
import { Deletable } from "./";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

const InputDropdown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => {
    if (props.options.length !== 0) setDropdownOpen((prevState) => !prevState)
  };

  return (
    <Dropdown className={"input-dropdown"} toggle={toggle}
      isOpen={dropdownOpen && props.options.length !== 0} direction="down">
      <DropdownToggle caret>
        <input onKeyDown={(e) => {if (e.key === "Enter") e.preventDefault()}}
          placeholder={props.placeholder} value={props.value} onChange={props.changeOption}
          type="text" name={props.name} required={props.required}
        />
        <span>▾</span>
      </DropdownToggle>
      <DropdownMenu>
        {props.options.map((c) => { return <DropdownItem text key={c}>
          <Deletable
            selectOption={props.selectOption}
            deleteOption={props.deleteOption}
          >{c}</Deletable>
        </DropdownItem>})}
      </DropdownMenu>
    </Dropdown>
  );
};

export default InputDropdown;
