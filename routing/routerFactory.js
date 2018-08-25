const { Router } = require('express');
const { Validator } = require('jsonschema');

const validator = new Validator();
const schemaConstructor = require('../validation/schemaConstuctor');

module.exports = class RouterFactory {
  static genCrud(model) {
    const router = new Router();
    router

      .get(`/${model.name}`, async (req, res) => {
        if (req.user.hasPriv(model.name, 'select*')) {
          const limits = req.user.getLims(model.name, 'select*');
          for (const limit in limits) {
            limits[limit] = req.user[limit];
          }
          const data = await model.findAndCountAll({
            'where': limits,
          });
          if (!data) {
            res.status(204).send();
            return;
          }
          res.status(200).json(data);
        }
        res.status(403).send();
      })

      .get(`/${model.name}/:id`, async (req, res) => {
        if (req.user.hasPriv(model.name, 'select')) {
          const data = await model.findById(req.params.id);
          if (!data) {
            res.status(404).send('No data with this ID!');
            return;
          }
          res.status(200).json(data.dataValues);
        }
        res.status(403).send();
      })

      .post(`/${model.name}`, async (req, res) => {
        if (req.user.hasPriv(model.name, 'insert')) {
          const schema = await schemaConstructor(model);
          const validated = validator.validate(req.body, schema);
          if (validated.errors[0] === undefined) {
            const newData = await model.create(req.body);
            res.json(newData);
            return;
          }
          res.status(409).send('Invalid data!');
        }
        res.status(403).send();
      })

      .put(`/${model.name}/:id`, async (req, res) => {
        if (req.user.hasPriv(model.name, 'update')) {
          let limits = req.user.getLims(model.name, 'update');
          if (!limits) {
            limits = { 'id': req.params.id };
          } else {
            for (const limit in limits) {
              limits[limit] = req.user[limit];
            }
            delete req.body.role;
          }
          const data = await model.findOne({
            'where': limits,
          });
          if (!data) {
            res.status(404).send('Not Found');
            return;
          }
          const updatedData = await data.update(req.body);
          res.json(updatedData.dataValues);
        }
        res.status(403).send();
      })

      .delete(`/${model.name}/:id`, async (req, res) => {
        if (req.user.hasPriv(model.name, 'update')) {
          let limits = req.user.getLims(model.name, 'update');
          if (!limits) {
            limits = { 'id': req.params.id };
          } else {
            for (const limit in limits) {
              limits[limit] = req.user[limit];
            }
          }
          const data = await model.findOne({
            'where': limits,
          });
          if (!data) {
            res.status(404).send('Not Found');
            return;
          }
          await data.destroy({ 'where': req.body });
          res.status(204).end();
        }
        res.status(403).send();
      });
    return router;
  }
};
