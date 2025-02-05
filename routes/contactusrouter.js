import express from "express";

import {create,getAllContact,deleteContactById} from '../controller/ContactusController.js'



const ContactusRouter = express.Router();

ContactusRouter.route("/create").post(create);
ContactusRouter.route("/getAll").get(getAllContact);
ContactusRouter.route("/delete/:id").delete(deleteContactById);


export default ContactusRouter