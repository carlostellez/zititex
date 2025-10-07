# Product Images

Esta carpeta contiene las imágenes para el módulo de productos con parallax.

## Estructura de Carpetas

```
/static/products/
├── etiquetas-composicion-bg.jpg    # Fondo parallax para etiquetas de composición
├── marquillas-marca-bg.jpg         # Fondo parallax para marquillas de marca  
├── etiquetas-especiales-bg.jpg     # Fondo parallax para etiquetas especiales
├── etiquetas/                      # Imágenes individuales de etiquetas
│   ├── etiqueta-composicion-basica.jpg
│   ├── etiqueta-composicion-premium.jpg
│   ├── etiqueta-transparente.jpg
│   ├── etiqueta-reflectiva.jpg
│   └── etiqueta-termoadhesiva.jpg
└── marquillas/                     # Imágenes individuales de marquillas
    ├── marquilla-tejida.jpg
    └── marquilla-saten-impresa.jpg
```

## Especificaciones de Imágenes

### Fondos Parallax (Categorías)
- **Resolución**: 1920x1080px (16:9) mínimo
- **Formato**: JPG optimizado
- **Peso**: Máximo 1MB por imagen
- **Calidad**: 80-85%
- **Composición**: Centrada, considerando overlays de texto

### Productos Individuales
- **Resolución**: 800x600px (4:3) 
- **Formato**: JPG optimizado
- **Peso**: Máximo 300KB por imagen
- **Calidad**: 85-90%
- **Fondo**: Preferiblemente blanco o transparente

## Efectos Parallax

Las imágenes de fondo se mueven a diferentes velocidades:
- **Etiquetas de Composición**: Velocidad 0.5 (media)
- **Marquillas de Marca**: Velocidad 0.3 (lenta)
- **Etiquetas Especiales**: Velocidad 0.7 (rápida)

## Overlays

Cada categoría tiene un overlay diferente:
- **Etiquetas de Composición**: Overlay oscuro
- **Marquillas de Marca**: Overlay gradiente
- **Etiquetas Especiales**: Overlay claro
