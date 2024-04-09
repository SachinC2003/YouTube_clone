import {Router} from "express"
import {registerUser,
        loginUser,
        logoutUser,
        refreshAccessToken,
        changeCurrentPassword,
        getCurrentUser,
        updateAccountDetails,
        updateUserAvatar,
        updateUserCoverImage,
        getUserChannelProfile,
        getWatchHistory} from "../controllers/user.controller.js";

        import {upload} from "../middlewares/multer.middleware.js"
        import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("./loginUser").post(loginUser)

router.route("/logout").post(logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-curr-pass").post(changeCurrentPassword)
router.route("/curr-user").post(getCurrentUser)
router.route("/update-account").post(updateAccountDetails)

router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/update-cover").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)

export default router