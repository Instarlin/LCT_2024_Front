import React from 'react';

const App = () => {
  const handleLoadSand = async (data) => {
    console.log(data)
    let formData = new FormData();
    formData.append("data", data[0])
    const response = await fetch(
      'http://192.144.13.15/api/bills', {
        method: 'POST',
        body: formData,
        headers: {
          "Authorization": `Bearer ${authToken.state.authToken}`,
          "Content-Type": "multipart/form-data",
        }
      }
    ) 
  }

  return (
    <>
      <form>
        <input multiple type="file" onChange={handleLoadSand}/>
      </form>
    </>
  );
};
export default App;