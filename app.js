var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose 				= require("mongoose"),
	expressSanitizer 		= require("express-sanitizer"),
    bcrypt                  = require("bcrypt"),
    url                     = require("./models/url"),
    base64                  = require('base-64'),
    utf8                    = require('utf8'),
    databaseURL 			= process.env.DATABASEURL || 'mongodb://localhost/urlshortner';
    
    mongoose.connect(databaseURL, { useNewUrlParser: true });
    app.use(express.static('pubic'));
    app.use(bodyParser.urlencoded({extended : true}));
    app.set("view engine","ejs");
    app.use(expressSanitizer());

    app.get("/",function(req,res){
        res.render("home");
    });

    app.get("/newurl",function(req,res){
        res.render("form");
    });

    app.get("/:id",function(req,res){
        url.find({shortUrl : req.params.id},
            function(err,url){
                if(err||!url[0]){
                    res.redirect("back");
                }else{
                    res.redirect(url[0].originalUrl);
                }
            });
    });

    app.post("/",function(req,res){
        var oUrl = req.sanitize(req.body.originalUrl);
        bcrypt.hash(oUrl, 10, function(err, hash) {
            if(err){
                console.log("An error occured");
                res.redirect("back");
            }
            else{
                var bytes = utf8.encode(hash);
                var encoded = base64.encode(bytes);
                url.create({
                    originalUrl : oUrl,
                    shortUrl : encoded.slice(30,35)
                },function(err,newUrl){
                    if(err){
                        console.log("An error occured");
                        res.redirect("back");
                    }else{
                        res.render("show",{ url : newUrl });
                    }
                });
            }
          });
    });

    app.listen(process.env.PORT||3000, function(){
        console.log("The Url Shortner server has started!");
     });