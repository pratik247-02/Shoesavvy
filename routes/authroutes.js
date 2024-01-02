import Express from "express";
import { registerController, 
    logincontroller, testcontroller, 
    forgotpasswordcontroller,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    updateOrderStatusController
} from "../controllers/authcontroller.js";
import { requireSignin, adminMiddleware } from "../middlewares/authmiddleware.js";



//router object
const Router = Express.Router();

//routing
//Register || method: POST
Router.post("/register", registerController);


//Login || method: POST
Router.post("/login", logincontroller);

//forgotpassword || method: POST
Router.post("/forgotpassword", forgotpasswordcontroller)


//testing route || method: GET
Router.get("/test", requireSignin, adminMiddleware,  testcontroller);

//protected route || method: GET
Router.get("/user", requireSignin, (req, res) => {
    res.status(200).send({ ok: true });
});

//protected route || method: GET
Router.get("/admin", requireSignin, adminMiddleware, (req, res) => {
    res.status(200).send({ ok: true });
});

//update user profile || method: PUT
Router.put("/profile", requireSignin, updateProfileController);

//orders
 Router.get("/orders", requireSignin, getOrdersController);

//admin orders
Router.get("/allorders", requireSignin, adminMiddleware, getAllOrdersController);

//order status
Router.put("/orderstatus/:orderid", requireSignin, adminMiddleware, updateOrderStatusController);

export default Router;
