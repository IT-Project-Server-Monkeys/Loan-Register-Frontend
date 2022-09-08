import React, { useState } from "react";
import "../styles/InputDropdown.scss"; // component scoped style
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

const InputDropdown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => {
    if (props.children.length !== 0) setDropdownOpen((prevState) => !prevState)
  };

  return (
    <Dropdown className={"input-dropdown"} toggle={toggle}
      isOpen={dropdownOpen && props.children.length !== 0} direction="down">
      <DropdownToggle caret>
        <input onKeyDown={(e) => {if (e.key === "Enter") e.preventDefault()}}
          placeholder={props.placeholder} value={props.value} onChange={props.changeOption}
          type="text" name={props.name} required={props.required} autoComplete="off"
        />
        <span>▾</span>
      </DropdownToggle>
      <DropdownMenu modifiers={ [
        { name: "eventListeners", options: { scroll: false } },
        { name: "preventOverflow", options: { mainAxis: false } }
      ] }>
        {props.children.map((d) => { return <DropdownItem
          text key={`drop-${d.key}`}>
            {d}
          </DropdownItem>
        })}
      </DropdownMenu>
    </Dropdown>
  );
};

export default InputDropdown;
