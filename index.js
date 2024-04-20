const { faker } = require('@faker-js/faker');
const express=require("express");
const app=express();
const {v4:uuidv4}=require("uuid");
const methodoverride=require("method-override");
const port="8081";
app.use(methodoverride("_method"));
const path=require("path");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

let getRandomUser=()=> {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
       faker.internet.email(),
       faker.internet.password(),
    ];
  }
const mysql = require('mysql2');

    const connection =  mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'delta_app',
      password: 'Srividhya@6'
    });
    
    
    
    app.listen(port,()=>{
        console.log(`listening to port ${port}`);
    })
app.get("/",(req,res)=>{
    let c=0;
    try{
        let q="select count(*) from user";
        connection.query(q,(err,result)=>{
            if(err)
            throw err;
            c=result[0]["count(*)"];
            res.render("home.ejs",{c});
        })
    }catch(err){
        console.log(err);
        res.send("some error in database");
    }
    
})
app.get("/user",(req,res)=>{
    
    let q="select * from user";
    try{
        connection.query(q,(err,result)=>{
            if(err)
            throw err;
            // console.log(result);
            res.render("user.ejs",{result});
        })
    }catch(err){
        console.log(err);
        res.send("some error in database");
    }
})
app.get("/user/:id",(req,res)=>{
    let {id}=req.params;
    let q=`select * from user where id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err)
            throw err;
        let u=result[0];
            console.log(u);
            res.render("edit.ejs",{u});
        })
    }catch(err){
        console.log(err);
        res.send("some error in database");
    }

})

app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
    let {username,email,password}=req.body;
    let q=`select * from user where id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err)
            throw err;
        let u=result[0];
            if(password!=u.password){
                res.send("wrong password");
            }
            else{
                let q=`update user set username='${username}',email='${email}' where id='${id}'`;
                try{
                    connection.query(q,(err,result)=>{
                        if(err)
                        throw err;
                        res.redirect("/user");
                    })
                }catch(err){
                    console.log(err);
                    res.send("some error in database");
                }
            }
        })
    }catch(err){
        console.log(err);
        res.send("some error in database");
    }
})

app.get("/new",(req,res)=>{
    // res.send("listening to new user");
    res.render("new.ejs");
})

app.post("/new",(req,res)=>{
    
    
    let id=uuidv4();
    let {name,email,password}=req.body;
    let q=`insert into user (id,username,email,password) values ('${id}','${name}','${email}','${password}')`;
    try{
    connection.query(q,(err,result)=>{
                if(err)
                throw err;
                res.redirect("/user");
         })
        }
        catch(err){
            console.log(err);
            res.send("some error in database");
        
        }
    
    })
    app.delete("/user/:id",(req,res)=>{
        let {id}=req.params;
        let q=`delete from user where id='${id}'`;
        try{
        connection.query(q,(err,result)=>{
            if(err){
                throw err;
            }
            res.redirect("/user");
        })
        }
        catch(err){
            res.send("error in database");
        }

    })