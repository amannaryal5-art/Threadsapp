const firebase = require('../config/firebase');
const { Notification, User } = require('../models');

exports.createNotification = async ({ userId, title, body, type = 'system', data = {} }) =>
  Notification.create({ userId, title, body, type, data });

exports.pushToUser = async ({ userId, title, body, type = 'system', data = {} }) => {
  const user = await User.findByPk(userId);
  const notification = await exports.createNotification({ userId, title, body, type, data });

  if (firebase && user?.fcmToken) {
    await firebase.send({
      token: user.fcmToken,
      notification: { title, body },
      data: Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value)])),
    });
  }

  return notification;
};

exports.broadcast = async ({ title, body, type = 'offer', data = {}, where = {} }) => {
  const users = await User.findAll({ where });
  await Promise.all(users.map((user) => exports.pushToUser({ userId: user.id, title, body, type, data })));
  return users.length;
};
