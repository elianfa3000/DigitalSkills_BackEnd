import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost/digilalskills");
    console.log(">>>----/mongooDB conestado");
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
