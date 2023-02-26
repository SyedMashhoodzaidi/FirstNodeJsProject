const express = require('express');
const mng=require("mongoose");
const BlogModel=require('./models/blog.js');
//express app
const app= express();

// Connecting To Cloud MongoDB
const dbURI='mongodb+srv://Mashhood:Mashhood@cluster0.bsurkl9.mongodb.net/BlogPostTestSite?retryWrites=true&w=majority';
mng.set({strictQuery:true}); // to avoid depcrication warnings


// using static middleware for Folders for css and images
app.use(express.static('./views/PublicFolder'))

// express middleware for posting a request
app.use(express.urlencoded({extended: true}));
//register view engine
app.set('view engine','ejs');

// views location folder
app.set('views','views');
// this above line is optional if the folder name is "views", bcz by default it will look for the folder name views:

//=============================================================================================================================

//Building a Connection to database server:
mng.connect(dbURI)
.then((result)=>{

    //:::::::::::::::::::::::::::::::::Listening ::::::::::::::::::::::
    app.listen(3000);
    console.log("Connected: ");
})
.catch((err)=>console.log(err));


// :::::::::::::::::::::::::::::::::::::::: Routes :::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::: Home Page ::::::::::::::::::::::::::::::::::::::::::::
app.get('/',(req,res)=>{

res.render('index.ejs',{title: 'Home'});


//how to send a file on browser:
// res.sendFile('./FolderName/FileName.extension', {root: __dirname});

});

// ::::::::::::::::::::::::::::::::::::::::::: Create a new blog :::::::::::::::::::::::::::::::::::::::::
app.get("/create",(req,res)=>{

    res.render("create",{title: "Create A New Blog "});
});
//::::::::::::::::::::::::::::::::::::::::::::: About Page :::::::::::::::::::::::::::::::::::::::::::::::
app.get("/about",(req,res)=>{
    res.render("about",{title: "About"});
});

//::::::::::::::::::::::::::::::::::::::::::::: Redirecting :::::::::::::::::::::::::::::::::::::::::::::::
app.get('/about-us',(req,res)=>{
    res.redirect('/about');

});
app.get('/all-blogs',(req,res)=>{
    BlogModel.find()
    .then((result)=>{
        res.render('allBlogs',{title: "All Blogs", blogArray :result})
    })
    .catch((err)=>console.log(err));
});
app.post("/blogs",(req,res)=>{
    const blog=new BlogModel({
        title: req.body.title,
        snippet: req.body.snippet,
        Body: req.body.body
    });
    // we can alse use : const blog=new BlogModel(req.body); : Because in this case req.body has the same struture as our schema:
    blog.save()
    .then((result)=>{
        res.redirect("/");
    })
    .catch((err)=>console.log(err));

});

app.post('/blogs/update',(req,res)=>{
    BlogModel.updateOne({
        title: req.body.title,
        snippet: req.body.snippet,
        Body: req.body.body
    }).then((result)=>{
        res.redirect("/all-blogs");
    })
    .catch(err=>console.log(err));
  });




//:::::::::::::::::::::::::::::::::::: Updating Data :::::::::::::::::::::::::::::::::::::::
app.get('/blogs/update/:id',(req,res)=>{
    const id=req.params.id;
    BlogModel.findById(id)
    .then((result)=>{
        res.render("update",{title: "Updating Blog", blog:result})
    })
    .catch(err => console.log(err));

});
//:::::::::::::::::::::::::::::::::::: Route Parameter ::::::::::::::::::::::::::::::::::::::
// app.get('/blogs/:id',(req,res)=>{
//     const id=req.params.id;
//     BlogModel.findById(id)
//     .then((result)=>{
//         res.render("details",{title: "Find By Id", blogArray: result});
//         console.log("sucess:");
//     })
//     .catch((err)=>{
//         res.render("404",{title: "Page not Found"})
//         console.log(err);
//     });
// });

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    BlogModel.findById(id)
      .then((result) => {
        if(result.title == null){
            res.render("404",{title: "Page Not Found"});
        }
        res.render('details', { blogArray: result, title: 'Blog Details' });
      })
      .catch((err) => {
        res.render("404",{title: "Page Not Found"});
        console.log(err);
      });
  });

  app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    
    BlogModel.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/all-blogs' });
      })
      .catch(err => {
        console.log(err);
      });
  });
// ::::::::::::::::::::::::::::::::::::::::::: Any other Page (404) ::::::::::::::::::::::::::::::::::::::::::
app.use((req,res)=>{
    res.render("404",{title: "Page Not Found"});
});
