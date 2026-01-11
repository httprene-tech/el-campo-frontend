# 🔧 CAMBIOS REQUERIDOS EN EL BACKEND

## Módulo: Finanzas - Permisos de CRUD por Creador

### 📋 Cambio 1: GastoListSerializer - Agregar campo `usuario`

**Archivo:** `backend/finanzas/serializers.py`

**Línea:** ~110-122 (GastoListSerializer)

**Cambio requerido:**
```python
class GastoListSerializer(serializers.ModelSerializer):
    """Serializer ligero para listado de gastos (sin fotos anidadas - mejora rendimiento)."""
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')
    proveedor_nombre = serializers.ReadOnlyField(source='proveedor_rel.nombre')
    tiene_comprobante = serializers.SerializerMethodField()

    class Meta:
        model = Gasto
        fields = [
            'id', 'proyecto', 'monto', 'descripcion', 'fecha', 
            'categoria', 'categoria_nombre', 'proveedor_rel', 'proveedor_nombre',
            'metodo_pago', 'es_retroactivo', 'tiene_comprobante', 'creado_en',
            'usuario'  # ← AGREGAR ESTE CAMPO
        ]
```

**Razón:** El frontend necesita saber quién creó cada gasto para mostrar/ocultar botones de editar/eliminar solo para el creador.

**Impacto:** Mínimo - solo agrega un campo numérico (ID) que ya existe en el modelo.

---

### ✅ VERIFICACIÓN: Otros Serializers

Los siguientes serializers **YA incluyen** el campo de usuario o creador:

- ✅ `GastoSerializer` (detail) - Ya tiene `usuario` y `usuario_detalle`
- ✅ `DocumentoSerializer` - Ya tiene `subido_por` (no `usuario`, pero es equivalente)
- ✅ `FotoAlbumSerializer` - Ya tiene `subido_por`
- ✅ `AlbumSerializer` - Ya tiene `creado_por`

**Nota:** Los serializers de Documentos y Galería ya tienen los campos necesarios, solo necesitan agregarse al serializer de listado si existe uno ligero (pero por ahora no hay, así que está bien).

---

## 📝 RESUMEN

**Cambio único requerido:**
- Agregar campo `'usuario'` a `GastoListSerializer.fields`

**Después de este cambio:**
- El frontend podrá comparar `gasto.usuario === user.user_id` para mostrar/ocultar botones
- Los permisos del backend ya están bien (IsOwnerOrAdmin), esto es solo para UI
