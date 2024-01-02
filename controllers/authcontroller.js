import usermodel from "../models/usermodel.js";
import ordermodel from "../models/ordermodel.js";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/authhelper.js"; 

//Register Controller
export const registerController = async (req, res) => {
    try {
      const { name, email, password, phone, address, secretquestion } = req.body;
      //validations
      if (!name) {
        return res.send({ error: "Name is Required" });
      }
      if (!email) {
        return res.send({ error: "Email is Required" });
      }
      if (!password) {
        return res.send({ error: "Password is Required" });
      }
      if (!phone) {
        return res.send({ error: "Phone no is Required" });
      }
      if (!address) {
        return res.send({ error: "Address is Required" });
      }
      if (!secretquestion) {
        return res.send({ error: "Answer is Required" });
      }
      //check user
      const exisitinguser = await usermodel.findOne({ email });
      //exisiting user
      if (exisitinguser) {
        return res.status(200).send({
          success: true,
          message: "Already Registered please login",
        });
      }
      //register user
      const hashedPassword = await hashPassword(password);
      //save
      const user = await new usermodel({
        name,
        email,
        phone,
        address,
        password: hashedPassword,
        secretquestion
      }).save();
  
      res.status(201).send({
        success: true,
        message: "User Registered Successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in Registeration",
        error,
      });
    }
  };


//logincontroller
export const logincontroller = async (req, res) => {
    try{
        const { email, password } = req.body;
        //validate
        if(!email || !password){
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        //check if user exists
        const user = await usermodel.findOne({ email });
        if(!user){
            return res.status(404).json({ success: false, message: "Email is not registered" });
        }

        const match = await comparePassword(password, user.password);
        if(!match){
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }
         const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        const { name, role } = user;
        const data = { name, email, role, phone:user.phone, address: user.address, token };
        res.status(200).json({ success: true, message: "Login successful", data });
        console.log(data)
    }
    catch(error){
        console.log(error);
        res.status(500).json({ success: false, message: "Error in Login" });
    }
}

//forgotpasswordcontroller
export const forgotpasswordcontroller = async(req, res) => {
  try {
    const {email, secretquestioin, newpassword} = req.body
    if (!email) {
      res.status(400).send({message: 'Email Required'})
    }
    if (secretquestioin) {
      res.status(400).send({message: 'Answer Required'})
    }
    if (!newpassword) {
      res.status(400).send({message: 'New password is Required'})
    }
    
  //check
  const user = await usermodel.findOne({email, secretquestioin})
  //validation
  if (!user) {
    return res.status(404).send({message: 'Wrong email or answer' , success: false})
  }
  const hashed = await hashPassword (newpassword)
  await usermodel.findByIdAndUpdate(user._id, {password:hashed})
  res.status(200).send({success: true, message: 'Password Reset Successful'})
  }
   catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: 'Something went wrong' , error})
  }
}

export const testcontroller = (req, res) => {
    res.send("Auth route working");
}

//updateProfileController
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    const user = await usermodel.findById(req.user._id);
    //check password
    if (password &&password.length < 6) {
      return res.status(400).send({message: 'Password must be atleast 6 characters long'})}
      const hashedPassword = password ? await hashPassword(password) : undefined
      const updateduser = await usermodel.findByIdAndUpdate(req.user._id,
         {name : name || user.name,
          email : email || user.email,
          phone : phone || user.phone,
          address : address || user.address,
          password : hashedPassword || user.password},
         {new: true})
    res.status(200).send({success: true, message: 'Profile Updated Successfully', updateduser})
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: 'Profile Not Updated' , error})
  }
}

//getOrdersController
export const getOrdersController = async (req, res) => {
  try {
    const orders = await ordermodel.find({buyer: req.user._id}).
    populate('products', '-productpictures').
    populate('buyer', 'name')
    res.status(200).send({success: true, message: 'Orders Fetched Successfully', orders})
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, 
      message: 'Orders Not Fetched' ,
       error})
  }
}

//getAllOrdersController
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await ordermodel.find({})
    .populate('products', '-productpictures')
    .populate('buyer', 'name')
    .sort('-createdAt')
    res.status(200).send({success: true, message: 'Admin Orders Fetched Successfully', orders})
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, 
      message: 'Admin Orders Not Fetched' ,
       error})
  }
}

//updateOrderStatusController
export const updateOrderStatusController = async (req, res) => {
  try {
    const {orderid} = req.params
    const { status} = req.body
    const orders = await ordermodel.findByIdAndUpdate(orderid, {status}, {new: true})
    res.status(200).send({success: true,
       message: 'Order Status Updated Successfully',
        orders})
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, 
      message: 'Order Status Not Updated' ,
       error})
      }
}