# 📊 REPORTE DE AUDITORÍA: Módulo de Finanzas

**Fecha:** ${new Date().toLocaleDateString('es-BO')}  
**Objetivo:** Profesionalizar el módulo de Finanzas comparando frontend vs backend

---

## ✅ LO QUE ESTÁ BIEN

### 1. **React Query Hooks**
- ✅ La mayoría de operaciones ya usan hooks de React Query
- ✅ Queries y mutations bien estructurados
- ✅ Invalidación de caché implementada correctamente

### 2. **Componentes Comunes**
- ✅ Se usa `LoadingSpinner` (exportado como `LoadingSpinner` en index.js, no `Spinner`)
- ✅ Todos los componentes comunes están siendo utilizados apropiadamente

### 3. **Iconos**
- ✅ No hay SVG inline, todos usan `lucide-react` ✅

### 4. **Cálculos del Backend**
- ✅ `total_gastado`, `saldo_restante`, `porcentaje_consumido` vienen del backend (ProyectoSerializer)
- ✅ `total_pagado` y `cantidad_gastos` vienen del backend (ProveedorSerializer)
- ✅ `resumen_mensual` viene del backend (endpoint `/gastos/resumen_mensual/`)

---

## ❌ PROBLEMAS ENCONTRADOS

### 🔴 CRÍTICO: Cálculos en Frontend que Deberían Venir del Backend

#### 1. **DashboardPage.jsx - Agregación por Categorías (Líneas 78-97)**

**Problema:**
```javascript
// ❌ MAL: Calculando agregación en frontend
const datosCategorias = React.useMemo(() => {
  if (allExpenses.length === 0) return [];
  
  const aggregation = allExpenses.reduce((acc, gasto) => {
    const catName = gasto.categoria_nombre || 'Sin categoría';
    if (!acc[catName]) {
      acc[catName] = 0;
    }
    acc[catName] += Number(gasto.monto);
    return acc;
  }, {});
  // ...
}, [allExpenses]);
```

**Impacto:**
- Está descargando TODOS los gastos solo para agregar por categoría
- El backend ya calcula `resumen_mensual`, debería calcular también `resumen_por_categoria`
- Esto es ineficiente y puede causar problemas de rendimiento con muchos gastos

**Solución:**
- El backend debería exponer un endpoint `/gastos/resumen_por_categoria/?proyecto=X`
- O incluir esta información en el serializer del proyecto
- **NOTA:** Este endpoint NO existe actualmente en el backend, pero debería crearse

---

### 🟡 MEDIO: Uso Directo de API en lugar de Hooks

#### 1. **ProyectosPage.jsx - Exportar PDF (Línea 64)**

**Problema:**
```javascript
// ❌ MAL: Usando API directamente
import { proyectosAPI } from '../../../api';
// ...
const response = await proyectosAPI.exportarPDF(proyecto.id, params);
```

**Impacto:**
- No sigue el patrón de usar hooks para todas las operaciones
- No aprovecha el sistema de caché/invalidación de React Query
- Menos consistente con el resto del código

**Solución:**
- Crear hook `useExportPDFProyecto` en `src/hooks/mutations/finanzas.js`

---

#### 2. **GaleriaPage.jsx - Fetch Directo (Línea 227)**

**Problema:**
```javascript
// ⚠️ AMBIGUO: Usando fetch nativo
const response = await fetch(foto.imagen);
```

**Impacto:**
- Aunque este caso es menos crítico (descarga de imagen), rompe el patrón
- Podría usar el apiClient para mantener consistencia

**Solución:**
- Mantener fetch está bien para descargas directas, pero podría considerar usar apiClient si necesita autenticación

---

### 🟠 MEDIO: Hooks Faltantes

#### 1. **Mutations Faltantes en `src/hooks/mutations/finanzas.js`**

**Hooks que FALTAN pero la API soporta:**

1. **`useExportPDFProyecto`** ❌
   - API existe: `proyectosAPI.exportarPDF(id, params)`
   - Usado en: `ProyectosPage.jsx` (línea 64)

2. **`useUpdateAlbum`** ❌
   - API existe: `albumesAPI.update(id, data)` (línea 83 en finanzas.js)
   - No usado actualmente, pero la funcionalidad existe

3. **`useUpdateCarpeta`** ❌
   - API existe: `carpetasAPI.update(id, data)` (línea 110 en finanzas.js)
   - No usado actualmente, pero la funcionalidad existe

4. **`useUpdateDocumento`** ❌
   - API NO existe: No hay `documentosAPI.update()` en el código
   - **Backend sí tiene**: `DocumentoViewSet` hereda de `ModelViewSet`, así que el endpoint PUT existe
   - **FALTA EN API CLIENT**: Debe agregarse `update` a `documentosAPI` en `src/api/modules/finanzas.js`

**Hooks que EXISTEN pero podrían mejorarse:**
- Todos los demás hooks están completos ✅

---

## 📋 COMPARACIÓN BACKEND vs FRONTEND

### Backend Expone (Serializers):

#### ProyectoSerializer:
- ✅ `total_gastado` (ReadOnlyField)
- ✅ `saldo_restante` (ReadOnlyField)
- ✅ `porcentaje_consumido` (SerializerMethodField)

#### ProveedorSerializer:
- ✅ `total_pagado` (ReadOnlyField)
- ✅ `cantidad_gastos` (SerializerMethodField)

#### GastoListSerializer:
- ✅ `tiene_comprobante` (SerializerMethodField)
- ✅ `categoria_nombre` (ReadOnlyField)
- ✅ `proveedor_nombre` (ReadOnlyField)

#### Endpoints Especiales:
- ✅ `/gastos/resumen_mensual/?proyecto=X` - Resumen agrupado por mes
- ✅ `/proyectos/{id}/exportar_pdf/` - Exportar PDF con filtros

### Frontend Calcula (NO DEBERÍA):

1. ❌ **Agregación por categorías** en DashboardPage
   - Backend NO expone esto actualmente
   - **RECOMENDACIÓN:** Crear endpoint `/gastos/resumen_por_categoria/?proyecto=X`

2. ✅ **Total de gastos** - Ya viene del backend
3. ✅ **Saldo restante** - Ya viene del backend
4. ✅ **Porcentaje consumido** - Ya viene del backend

---

## 🎯 RESUMEN DE ARCHIVOS A MODIFICAR/CREAR

### Hooks a CREAR/MODIFICAR:

#### `src/hooks/mutations/finanzas.js`
1. ✅ Agregar `useExportPDFProyecto`
2. ✅ Agregar `useUpdateAlbum` (opcional, para futuras funcionalidades)
3. ✅ Agregar `useUpdateCarpeta` (opcional, para futuras funcionalidades)

#### `src/api/modules/finanzas.js`
1. ✅ Agregar `update` a `documentosAPI` (el backend lo soporta pero falta en el cliente)

#### `src/modules/finanzas/pages/ProyectosPage.jsx`
1. ✅ Reemplazar `proyectosAPI.exportarPDF` por `useExportPDFProyecto`

#### `src/modules/finanzas/pages/DashboardPage.jsx`
1. ⚠️ **DECISIÓN REQUERIDA:** 
   - Opción A: Crear endpoint backend `/gastos/resumen_por_categoria/`
   - Opción B: Mantener cálculo en frontend (menos ideal)
   - **RECOMENDACIÓN:** Opción A (crear endpoint backend)

---

## ✅ COMPONENTES COMUNES - ESTADO

### Componentes USADOS ✅:
- `LoadingSpinner` ✅ (correcto, NO se llama "Spinner")
- `Modal` ✅
- `BottomSheet` ✅
- `Button` ✅
- `Card` ✅
- `Input` ✅
- `Select` ✅
- `Toast` ✅
- `Skeleton`, `SkeletonCard`, `SkeletonRow` ✅
- `FAB` ✅

### Componentes NO USADOS (pero exportados):
- `PWAInstallBanner` - No usado en finanzas (pero puede usarse en otros módulos)
- Todos los demás componentes están siendo utilizados ✅

---

## 📝 CHECKLIST DE PROFESIONALIZACIÓN

- [ ] Crear endpoint backend `/gastos/resumen_por_categoria/?proyecto=X`
- [ ] Crear hook `useExportPDFProyecto` en mutations
- [ ] Agregar `update` a `documentosAPI` en api client
- [ ] Crear hooks `useUpdateAlbum` y `useUpdateCarpeta` (opcional)
- [ ] Reemplazar `proyectosAPI.exportarPDF` por hook en ProyectosPage
- [ ] Usar endpoint de resumen por categoría en DashboardPage (cuando exista)
- [ ] Verificar que todos los cálculos vengan del backend

---

## 🎓 NOTAS FINALES

1. **El componente se llama `LoadingSpinner`, NO `Spinner`** ✅
2. **No hay SVG inline, todos usan lucide-react** ✅
3. **La mayoría de hooks ya están bien implementados** ✅
4. **El problema principal es la agregación por categorías en frontend** 🔴
5. **Falta un hook para exportar PDF** 🟡
6. **Falta método update en documentosAPI** 🟡

---

**Estado General:** 🟡 **75% Profesionalizado**

El módulo está bastante bien estructurado, pero necesita:
- 1 cálculo movido al backend (categorías)
- 1 hook adicional (exportar PDF)
- 1 método API adicional (update documentos)
