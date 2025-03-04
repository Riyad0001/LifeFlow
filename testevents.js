// alert()

const LoadEvents=()=>{
    fetch("https://blood-donation-awo3.onrender.com/api/events/")
    .then((res)=>res.json())
    .then((data)=>console.log(data));
};
LoadEvents()