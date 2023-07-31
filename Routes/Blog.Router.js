const {Router} = require("express")
const {BlogModel} = require("../Models/BlogModel")
const {UserModel} = require("../Models/UserModel")

 const blogRouter  = Router();

blogRouter.get("/", async(req, res)=> {
    const blogs = await BlogModel.find();
    res.send({Message: "BLOGS.." , blogs: blogs})
})

blogRouter.post("/create", async(req, res)=> {
    const {title , description}= req.body;
    const author_id = req.user_id
    const user = await UserModel.findOne({_id:author_id})
    const new_blog = new BlogModel({
        title,
        description,
        author_email: user.email,
        author_name : user.name 
    })
        await new_blog.save()
        res.send({Message: "Blog Created Successfully"})

})

blogRouter.put("/update/:blogID", async(req, res)=> {
         const blogID = req.params.blogID
    const payload  = req.body

    const user_id = req.user_id
    const user =await UserModel.findOne({_id:user_id})
    const user_email = user.email
    console.log(user_email)

    const blog = await BlogModel.findOne({_id:blogID})
    const blog_author_email = blog.author_email
    console.log(blog_author_email)
        if(user_email == blog_author_email) {
    const update_blog = await BlogModel.findByIdAndUpdate(blogID , payload)
    res.send({Message: "BLOGS. Updated."})
        }
        else{
            res.send({Message: "You are not allowed to Perform this Operation"})
        }
})



blogRouter.delete("/delete/:blogID", async(req, res)=> {
        const blogID = req.params.blogID
        const user_id = req.user_id
        const user = await UserModel.findOne({_id:user_id})

console.log(user.email)
        const blog = await BlogModel.findOne({_id: blogID})
        console.log(blog.author_email)
        if(user.email  != blog.author_email){
            res.send({Message: "You are not allowed to Perform this Operation"})
        }
        else{
            await BlogModel.findByIdAndDelete(blogID)
            res.send({Message: "BLOGS Delted.."})
        }
})
module.exports= {blogRouter} 