const { DataTypes } = require("sequelize");
const { sequelize_users, connectDB } = require("../config/db.js");
const bcrypt = require("bcrypt");

const User = sequelize_users.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
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
  cardBrand: {
      type: DataTypes.STRING, // Visa, Mastercard, etc.
      allowNull: true
  },
  last4: {
      type: DataTypes.STRING(4), // Últimos 4 dígitos de la tarjeta
      allowNull: true
  },
  expMonth: {
      type: DataTypes.INTEGER,
      allowNull: true
  },
  expYear: {
      type: DataTypes.INTEGER,
      allowNull: true
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
