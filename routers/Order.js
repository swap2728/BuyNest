const express = require('express');
const { createOrder, fetchOrdersByUser, deleteOrder, updateOrder } = require('../controller/Orders');
const { fetchAllOrders } = require('../controller/Orders');

const router = express.Router();
router.post('/', createOrder)
      .get('/own/', fetchOrdersByUser)
      .delete('/:id', deleteOrder)
      .patch('/:id', updateOrder)
      .get('/',fetchAllOrders)


exports.router = router;