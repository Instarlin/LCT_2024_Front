import React from "react";

const CSVDataTable = () => {
  const handleLoad = async (data) => {
    const response = await fetch() 
  }

  return (
    <>
      <form>
        <input multiple type="file" onChange={handleLoad}/>
      </form>
    </>
  );
};

export default CSVDataTable;