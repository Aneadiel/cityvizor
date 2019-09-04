import express from 'express';

import config from "../../config";
import multer from 'multer';
import path from "path";

import * as fs from "fs-extra";

import { db } from "../../db";
import { ProfileRecord } from '../../schema/database';

const router = express.Router();

export const AdminProfilesRouter = router;

const upload = multer({ dest: config.storage.tmp });

router.get("/", async (req, res, next) => {

  const profiles = await db<ProfileRecord>("app.profiles").select("id", "status", "name", "url", "gpsX", "gpsY", "main");

  res.json(profiles);
});

router.post("/", async (req, res) => {

  const id = await db<ProfileRecord>("app.profiles")
    .insert(req.body, ["id"])
    .then(result => result[0].id);

  res.location("/profiles/" + id);

  res.sendStatus(201);
});

router.get("/:profile", async (req, res, next) => {

  const profile = await db<ProfileRecord>("app.profiles").where({ id: req.params.profile }).first();

  profile.avatarUrl = config.apiRoot + "/public/profiles/" + profile.id + "/avatar";

  res.json(profile);
});

router.patch("/:profile", async (req, res, next) => {

  await db("app.profiles")
    .where({ id: req.params.profile })
    .update(req.body);

  res.sendStatus(204);
});

router.delete("/:profile", async (req, res, next) => {
  await db("app.profiles")
    .where({ id: req.params.profile })
    .delete();
  res.sendStatus(204);
});

router.put("/:profile/avatar", upload.single("avatar"), async (req, res, next) => {

  if (!req.file) return res.status(400).send("Missing file.");

  var allowedTypes = [".png", ".jpg", ".jpe", ".gif", ".svg"];

  var extname = path.extname(req.file.originalname).toLowerCase();

  if (allowedTypes.indexOf(extname) === -1) return res.status(400).send("Allowed file types are: " + allowedTypes.join(", "));

  const profile = await db<ProfileRecord>("app.profiles").select("id", "avatarType").where({ id: req.params.profile }).first();
  if (!profile) return res.sendStatus(404);

  const avatarPath = path.join(config.storage.avatars, "avatar_" + req.params.profile + extname);

  await fs.move(req.file.path, avatarPath);

  await db<ProfileRecord>("app.profiles").where({ id: req.params.profile }).update({ avatarType: extname });

  res.sendStatus(204);
});

router.delete("/:profile/avatar", async (req, res, next) => {

  const profile = await db<ProfileRecord>("app.profiles").select("id", "avatarType").where({ id: req.params.profile }).first();
  if (!profile) return res.sendStatus(404);

  if (!profile.avatarType) return res.sendStatus(204);

  const avatarPath = path.join(config.storage.avatars, "avatar_" + profile.id + profile.avatarType);

  await fs.remove(avatarPath);

  await db<ProfileRecord>("app.profiles").where({ id: req.params.profile }).update({ avatarType: null });

  res.sendStatus(204);

});