// Main Express application: configures the server, database, and listing routes.
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path=require("path")
const methodOverride=require("method-override");

// Local MongoDB database used to store the listing documents.
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
});

// Connect to MongoDB before the server handles database-backed requests.
async function main() {
    await mongoose.connect(MONGO_URL);
}

// Configure EJS templates and parse HTML form bodies, including nested listing fields.
app.set("view engine","ejs");
app.set ("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

// Basic landing route for the application.
app.get("/", (req, res) => {
    res.send("hi i am root ");
});

// Show all listings.
//index  route
app.get("/listings",async(req,res)=> {
const allListings = await Listing.find({});
res.render("listings/index.ejs",{allListings});
});

// Display the form used to create a listing.
//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

// Find one listing by its MongoDB ID and render its details.
//show route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render  ("listings/show.ejs",{listing});
});

// Save submitted form data as a new listing, then return to the index.
//create route
app.post("/listings",async(req,res)=>{
  const newListing=new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// Load an existing listing into the edit form.
//edit route
app.get ("/listings/:id/edit",async(req,res)=>{
let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render  ("listings/edit.ejs",{listing});
});

// Apply submitted changes to the selected listing, then show it.
//update route
app.put ("/listings/:id",async(req,res)=>{
let {id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings/${id}`);
});

// app.get("/testListing", async (req, res) => {
//     const sampleListing = new Listing({
//         title: "villa",
//         description: "villa",
//         price: 1200,
//         location: "goa",
//         country: "india"
//     });
//     await sampleListing.save();
//     console.log("sample saved");
//     res.send("success");
// });

// Start the web server on port 8080.
app.listen(8080, () => {
    console.log("server is listening on port 8080");
});
