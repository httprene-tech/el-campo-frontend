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

### 📋 Cambio 2: AlbumListSerializer - Agregar campo `creado_por`

**Archivo:** `backend/finanzas/serializers.py`

**Línea:** ~194-201 (AlbumListSerializer)

**Cambio requerido:**
```python
class AlbumListSerializer(serializers.ModelSerializer):
    """Serializer ligero para listado de álbumes (sin fotos anidadas)."""
    cantidad_fotos = serializers.ReadOnlyField()
    portada = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = ['id', 'nombre', 'descripcion', 'creado_en', 'cantidad_fotos', 'portada', 'creado_por']  # ← AGREGAR 'creado_por'
```

**Razón:** El frontend necesita saber quién creó cada álbum para mostrar/ocultar botones de eliminar solo para el creador.

**Impacto:** Mínimo - solo agrega un campo numérico (ID) que ya existe en el modelo.

---

## 📝 RESUMEN

**Cambios requeridos:**
1. ✅ Agregar campo `'usuario'` a `GastoListSerializer.fields`
2. ✅ Agregar campo `'creado_por'` a `AlbumListSerializer.fields`

**Después de estos cambios:**
- El frontend podrá comparar `gasto.usuario === user.user_id` para mostrar/ocultar botones en GastosPage
- El frontend podrá comparar `album.creado_por === user.user_id` para mostrar/ocultar botones en GaleriaPage
- Los permisos del backend ya están bien (IsOwnerOrAdmin), esto es solo para UI
