// src/models/Rol.model.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Rol = sequelize.define(
    "Rol",
    {
      idRol: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "id_rol",
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: "nombre",
      },
      descripcion: {
        type: DataTypes.TEXT,
        field: "descripcion",
      },
      estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        field: "estado",
      },
      tipoPerfil: {
        type: DataTypes.ENUM("CLIENTE", "EMPLEADO", "NINGUNO"),
        allowNull: false,
        defaultValue: "EMPLEADO",
        field: 'tipo_perfil',
        comment:
          'Define el tipo de perfil asociado a este rol. "CLIENTE" para clientes, "EMPLEADO" para personal, "NINGUNO" para roles sin perfil de datos (ej. Admin).',
      },
    },
    {
      tableName: "rol",
      timestamps: false,
    }
  );

  Rol.associate = (models) => {
    // Un rol puede tener muchos usuarios.
    Rol.hasMany(models.Usuario, {
      foreignKey: "idRol",
      as: "usuarios",
    });

    // Un rol puede tener muchos permisos a través de la tabla de unión.
    Rol.belongsToMany(models.Permisos, {
      through: "permisos_x_rol",
      foreignKey: "id_rol",
      otherKey: "id_permiso",
      as: "permisos",
    });
  };

  return Rol;
};