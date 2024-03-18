if(process.env.NODE_ENV == "production"){
    module.exports ={mongoURI: "mongodb+srv://sergioweb100:Vk3Rt8S3xQO67Rk1@blogapp-prod.dxuczpq.mongodb.net/?retryWrites=true&w=majority&appName=blogapp-prod"}
} else {
    module.exports = {mongoURI:"mongodb://localhost/blogapp"}
}