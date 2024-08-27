const AuditLog = sequelize.define('AuditLog', {
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ticketId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Tickets',
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Utilisateurs',
            key: 'id',
        },
    },
    details: {
        type: DataTypes.TEXT,
    },
}, {
    timestamps: true,
});