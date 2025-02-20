const { DataTypes } = require("sequelize");
const { sequelize_users, connectDB } = require("../config/db.js");
const bcrypt = require("bcrypt");

/**
 * Modelo de usuario.
 */
const User = sequelize_users.define(
  "User",
  {
    id: {
      type: DataTypes.UUID, // Identificador único
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING, // Nombre de usuario
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING, // Correo electrónico
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING, //Contraseña encriptada
      allowNull: false,
    },
    resetToken: {
      type: DataTypes.STRING, // Token temporal para recuperar contraseña
      allowNull: true,
    },
    resetTokenExpires: {
      type: DataTypes.DATE, // Fecha de expiración del token
      allowNull: true,
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true // Se asigna al registrar la tarjeta
  },
  paymentMethodId: {
      type: DataTypes.STRING,
      allowNull: true, // Se asigna cuando el usuario guarda una tarjeta
      unique: true
  },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);

module.exports = User;
