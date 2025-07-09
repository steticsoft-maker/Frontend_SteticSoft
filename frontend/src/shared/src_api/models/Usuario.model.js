// src/models/Usuario.model.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    'Usuario',
    {
      idUsuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id_usuario'
      },
      correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: 'correo',
        validate: {
          isEmail: true
        }
      },
      contrasena: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'contrasena'
      },
      idRol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_rol',
        references: {
          model: 'rol',
          key: 'id_rol'
        },
        onDelete: 'RESTRICT'
      },
      estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        field: 'estado'
      }
    },
    {
      tableName: 'usuario',
      timestamps: false
    }
  );

  Usuario.associate = (models) => {
    // Un Usuario pertenece a un Rol.
    Usuario.belongsTo(models.Rol, {
      foreignKey: 'idRol', // Correcto: Coincide con el atributo 'idRol' de este modelo.
      as: 'rol'
    });

    // Un Usuario tiene un perfil de Cliente (relación 1 a 1).
    Usuario.hasOne(models.Cliente, {
      foreignKey: 'idUsuario', // Asume que en Cliente.model.js la FK se llama 'idUsuario'.
      as: 'clienteInfo'
    });

    // Un Usuario tiene un perfil de Empleado (relación 1 a 1).
    Usuario.hasOne(models.Empleado, {
      foreignKey: 'idUsuario', // Asume que en Empleado.model.js la FK se llama 'idUsuario'.
      as: 'empleadoInfo'
    });

    // Un Usuario puede tener muchos Tokens de Recuperación.
    Usuario.hasMany(models.TokenRecuperacion, {
      foreignKey: 'idUsuario', // Asume que en TokenRecuperacion.model.js la FK se llama 'idUsuario'.
      as: 'tokensRecuperacion'
    });
  };

  return Usuario;
};