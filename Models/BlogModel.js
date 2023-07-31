const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
   title: String,
   description: String,
    author_name:String,
     author_email: String,
},
{
    timestamps: true
})
const BlogModel = new mongoose.model('blog' , blogSchema);
module.exports = {BlogModel}