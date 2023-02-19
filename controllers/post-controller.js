import mongoose,{mongo, startSession} from "mongoose";
import Post from "../models/Post";
import User from "../models/User";

export const getAllPosts = async (req, res) => {
    let posts;
    try {
        posts = await Post.find().populate("user");

    } catch (err) {
        return console.log(err)
    }

    if (!posts) {
        return res.status(500).json({ message: "Unexpected error occured" })
    }

    return res.status(200).json({ posts });
};




// post 
export const addPost = async (req, res) => {
    const { title, description, location, date, image, user } = req.body;

    if (!title &&
        title.trim() === "" &&
        !description &&
        description.trim() === "" &&
        !location &&
        location.trim() === "" &&
        !date &&
        !image &&
        !user &&
        image.trim() === "") {
        res.status(422).json({ message: "invalid data" })
    }

    // these code edded at the end time
    let existingUser;
    try {
        existingUser = await User.findById(user);
    } catch (err) {
        return console.log(err)
    }

    if (!existingUser) {
        return res.status(404).json({ message: "user not found" });
    }
    // above code edded at the end time


    let post;
    try {
        post = new Post({
            title,
            description,
            image,
            location,
            date: new Date(`${date}`),
            user
        });



        //we need to save post in user post array;
        //made the following changes at last
        const session = await mongoose.startSession();
        session.startTransaction();
        existingUser.posts.push(post);
        await existingUser.save({ session });
        post = await post.save({ session });
        session.commitTransaction()

        //made the following changes at last



        // post = await post.save();  //updated into the above code

    } catch (err) {
        console.log(err)
    }

    if (!post) {
        return res.status(500).json({ message: "unexpectedError occured" })
    }

    return res.status(201).json({ post })

};




//id
export const getPostById = async (req, res) => {
    const id = req.params.id;

    let post;
    try {
        post = await Post.findById(id);
    } catch (err) {
        return console.log(err)
    }

    if (!post) {
        return res.status(404).json({ message: "no post found" });
    }


    return res.status(200).json({ post })
}




// update post;
export const updatePost = async (req, res) => {
    const id = req.params.id;
    const { title, description, location, image } = req.body;

    if (!title &&
        title.trim() === "" &&
        !description &&
        description.trim() === "" &&
        !location &&
        location.trim() === "" &&
        !image &&
        image.trim() === "") {
        res.status(422).json({ message: "invalid data" })
    };

    let post;
    try {
        post = await Post.findByIdAndUpdate(id, {
            title, description, image,
            location
        });
        // we don't need to save data in update because mongodb itself save it in update functionalty;
    } catch (err) {
        return console.log(err)
    }

    if (!post) {
        return res.status(500).json({ message: "unable to update" });
    };


    return res.status(200).json({ message: "updated successfully" })

}



//delete the post;
export const deletePost = async (req, res) => {
    const id = req.params.id;
    let post;

    try {
        //make changes at the last
        const session = await mongoose.startSession();
        session.startTransaction();
        post = await Post.findById(id).populate("user");
        post.user.posts.pull(post);
        await post.user.save({session});
        post = await Post.findByIdAndRemove(id);
        session.commitTransaction();
        //make changes at the last

        //post = await Post.findByIdAndRemove(id);
    } catch (err) {
        console.log(err)
    }

    if (!post) {
        return res.status(500).json({ message: "unable to delete" });
    }


    return res.status(200).json({ message: "deleted successfuly" });

}