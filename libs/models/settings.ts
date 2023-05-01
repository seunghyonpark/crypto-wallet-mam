import { model, models, Schema } from "mongoose";
import connectMongo from "../services/database";

connectMongo();

const SettingsSchema = new Schema({
  requestType: {
    type: String,
    required: true,
  },
  chat: {
    type: Boolean,
    required: false,
  },
});

export const SettingModel =
  models.Settings || model("Settings", SettingsSchema);

export const createSettings = async (requestType: string, chat: boolean) => {
  const settings = new SettingModel({
    requestType,
    chat,
  });
  await settings.save();
};

export const getSettings = async () => {
  const settings = await SettingModel.find();
  return settings;
};

export const updateSettings = async (
  _id: string,
  requestType: string,
  chat: boolean
) => {
  const settings = await SettingModel.findOneAndUpdate(
    { _id },
    { chat, requestType },
    { new: true }
  );
  return settings;
};

export const deleteSettings = async (_id: string) => {
  const deleted = await SettingModel.findOneAndDelete({ _id });
  return deleted;
};
