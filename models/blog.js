const mng=require('mongoose');
const sch=mng.Schema;

const blogSchema=new sch({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    Body: {
        type: String,
        required: true
    }
},{timestamps: true});

const Blog=mng.model('Blog',blogSchema);
module.exports=Blog;