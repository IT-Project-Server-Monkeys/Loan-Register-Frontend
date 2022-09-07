import React, { Component } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { BsArrowUpShort } from 'react-icons/bs';


const FilterDropdown = (props) => {

  const { text, sortDate } = props;

  return (
    <div className="filter-box">
      <span>{text}{sortDate && <BsArrowUpShort size={30} />}</span>
      <MdKeyboardArrowDown size={30} />
    </div>
  );
};

export default FilterDropdown;
