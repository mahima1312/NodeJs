//How do we able to communicate with servers using different API`s
//Here we Used MongoDB
const express= require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
dotenv.config()

const app=express()

const {PORT,DB_USER,DB_PASSWORD}=process.env

const dbURL=`mongodb+srv://${DB_USER}:${DB_PASSWORD}@mahima1312.onx09.mongodb.net/?retryWrites=true&w=majority&appName=mahima1312`

//here our server is contacting DB in async mode 
mongoose.connect(dbURL).then(function(connection){
    console.log("Connection Success")
}).catch(error=> console.log(error))

//Set of business rules that entity should follow
const userSchemaRules={
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    confirmPassword:{
        type:String,
        required:true,
        minlength:8,
        validate:()=>{
            return this.password===this.confirmPassword
        }
    },
    createAt:{
        type:Date,
        default:Date.now()
    }

}

const userSchema= new mongoose.Schema(userSchemaRules)

//this modal => will have queries and syntaxes
const UserModel= new mongoose.model("UserModal",userSchema)



app.use(express.json())

//check the details are empty or not in post method with middleware fucntion
app.use((req,res,next)=>{
    if(req.method==="POST"){
        const userDetails=req.body
        const isEmpty=Object.keys(userDetails).length===0
        if(isEmpty){
            res.status(400).json({
                status:"Failure",
                message:"User Details are Empty"
            })
        }else{
            next()
        }
    }else{
        next()
    }
})

/***** APIs ********/

//GET API
app.get("/api/user/",getAllUsers)
//to get user based on id -> template routing
//GET API BY ID
app.get("/api/user/:userId/",getUserDetailsById)
//to create User
app.post("/api/user/",createUser)

/******* Handler Functions *******/

async function getAllUsers(req,res){
    try{
        //getting data from DB
        const userData=await UserModel.find()  
        if(userData.length===0){
            throw new Error("No Users Found")
    }else{
    }
    const object={
        status:"success",
        message:userData
    }
    res.status(200).json(object)
    }catch(err){
        const object={
            status:"Failure",
            message:err.message
        }
        res.status(400).json(object)
    }
}

async function getUserDetailsById(req,res){
    try{
        const userId=req.params.userId
        const userData= await UserModel.findById(userId)
       if(userData==="No User Found"){
           throw Error(`User with ${id} not Found`)
       }else{
           res.status(200).json(userData)
       }
   }catch(err){
       res.status(404).json({
           status:"Failure",
           message:err.message
       })
   }
}

async function createUser(req,res){
    try{
        const userDetails=req.body
        //adding user to DB 
        const user = await UserModel.create(userDetails)

        res.status(200).json({
            status:"Success",
            message:"User Details Added Successfully",
            user
        })

    }catch(err){
        res.status(400).json({
            status:"Failure",
            message:err.message
        })
    }
}


app.use((req,res)=>{
    res.status(404).json({
        status:"Failure",
        message:"Page Not Found"
    })
})



app.listen(PORT,()=>{
    console.log(`Server Running at http://localhost:${PORT}`)
})