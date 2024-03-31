import express from 'express';
import controller from '../../controller/admin-controllers/confiurations-controller.js'

const app = express();

// GET request for list of all Items.
app.get("/", controller.list);

// GET request for one Item.
app.get("/:id", controller.detail);

// GET request for one Item.
app.get("/:id/dbc/:can_dbc_id", controller.detail_with_dbc);

// GET request for one Item.
app.get("/:id/col/:can_req_col_id", controller.detail_with_col);

// GET request for one Item.
app.get("/active-messages/:device_id", controller.get_all_active_messages);

// POST request for creating Item.
app.post("/create", controller.create_post);

// POST request to update Item.
app.post("/:id/update", controller.update_post);

// POST request to delete Item.
app.post("/:id/delete", controller.delete_post);


export default app;