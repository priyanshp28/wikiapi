const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://priyansh28:password@cluster0.cy8r8rs.mongodb.net/wikiDB", { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);


// --------------  requests targetting all articles ---------------
app.route("/articles")
    .get(function (req, res) {
        Article.find()
            .then(function (foundArticles) {
                res.send(foundArticles);
            })
            .catch(function (err) {
                res.send(err);
            })
    })
    .post(function (req, res) {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save()
            .then(function () {
                res.send("Successfully added a new article.");
            })
            .catch(function (err) {
                res.send(err);
            })

    })
    .delete(function (req, res) {
        Article.deleteMany()
            .then(function () {
                res.send("successfully deleted all articles .");
            })
            .catch(function (err) {
                res.send(err);
            })
    });


// --------------  requests targetting specific articles ---------------
app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle })
            .then(function (foundarticles) {
                if (foundarticles)
                    res.send(foundarticles);
                else
                    res.send("NO articles matching that title was found");
            })
            .catch(function (err) {
                res.send(err);
            })
    })

    .put(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            {$set:{ title: req.body.title, content: req.body.content} },
            { overwrite: true }

        )
            .then(function () {
                res.send("successfully updated articles.");
            })
            .catch(function (err) {
                res.send(err);
            })
    })


    .patch(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            {$set: req.body }

        )
            .then(function () {
                res.send("successfully updated articles.");
            })
            .catch(function (err) {
                res.send(err);
            })
    })


    .delete(function (req, res) {
        Article.deleteOne({title: req.params.articleTitle})
            .then(function () {
                res.send("successfully deleted specified articles .");
            })
            .catch(function (err) {
                res.send(err);
            })
    });

app.listen(process.env.PORT || 3000, function () {
    console.log("server has started running successfully");
})

