import React, { memo } from 'react';
import { Card } from '../../../components/common';
import { Users, Phone, MapPin, Briefcase, Trash2, Edit2, Wallet } from 'lucide-react';

/**
 * ProveedorCard - Tarjeta de proveedor con información de contacto
 * Reutilizable para mostrar proveedores/contactos de negocio
 */
const ProveedorCard = memo(({ proveedor, onEdit, onDelete }) => (
  <Card className="relative group">
    {/* Acciones */}
    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {onEdit && (
        <button
          onClick={() => onEdit(proveedor)}
          className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          style={{ touchAction: 'manipulation' }}
        >
          <Edit2 className="w-4 h-4 text-gray-500" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => onDelete(proveedor.id)}
          className="p-2 bg-white rounded-lg shadow-sm hover:bg-red-50 transition-colors"
          style={{ touchAction: 'manipulation' }}
        >
          <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
        </button>
      )}
    </div>

    <div className="flex items-start gap-3 mb-4">
      <div className="p-3 bg-blue-50 rounded-xl flex-shrink-0">
        <Users className="w-6 h-6 text-blue-500" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{proveedor.nombre}</h3>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <Briefcase className="w-3 h-3" />
          {proveedor.especialidad || 'Sin especialidad'}
        </p>
      </div>
    </div>

    <div className="space-y-2">
      {proveedor.telefono && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <a 
            href={`tel:${proveedor.telefono}`} 
            className="hover:text-emerald-600 transition-colors"
          >
            {proveedor.telefono}
          </a>
        </div>
      )}
      {proveedor.direccion && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <span className="truncate">{proveedor.direccion}</span>
        </div>
      )}
    </div>

    {/* Total pagado */}
    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
      <span className="text-sm text-gray-500">Total Pagado</span>
      <div className="flex items-center gap-1">
        <Wallet className="w-4 h-4 text-emerald-500" />
        <span className="font-semibold text-emerald-600">
          {Number(proveedor.total_pagado || 0).toLocaleString('es-BO')} Bs
        </span>
      </div>
    </div>
  </Card>
));

ProveedorCard.displayName = 'ProveedorCard';

export default ProveedorCard;
