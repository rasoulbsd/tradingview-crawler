const router = require('express').Router();

const controller_get = require("../controllers/controller_get");
const controller_post = require("../controllers/controller_post");
const send_localstorage_get = require("../controllers/send_localstorage_get");
const run_docker_get = require("../controllers/run_docker_get");
const run_docker_post = require("../controllers/run_docker_post");

// /apify/run
router.route("/run")
    .post(controller_post.runApify)
    .get(controller_get.runApify)

router.route("/send_localstorage")
    .get(send_localstorage_get.runApify)

router.route("/run_docker")
    .get(run_docker_get.runApify)
    .post(run_docker_post.runApify)

module.exports = router;
