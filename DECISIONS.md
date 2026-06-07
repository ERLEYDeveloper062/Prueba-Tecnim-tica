# DECISIONS.md

Decisiones de diseño y razonamiento detrás del proyecto.

---

## 1. ¿Cómo modelaste la relación entre sensores y zonas y por qué?

La relación entre sensores y zonas es **muchos a muchos**: un sensor puede operar en múltiples zonas y una zona puede tener múltiples sensores instalados.

Para representarla utilicé la tabla `monitoreos` como **tabla de asociación con atributos propios**. No es una tabla de unión simple (solo dos claves foráneas) sino una entidad de pleno derecho que describe *cómo* un sensor está instalado en una zona: cuándo se instaló (`fecha_instalacion`), qué mide (`tipo_lectura`), cuál es su umbral de alerta (`valor_umbral`) y si está activo o pausado (`estado`).

Esta decisión refleja el dominio real: colocar un sensor en una zona no es un hecho binario, sino una instalación con contexto propio. Modelarlo así permite consultar el historial de instalaciones, filtrar por estado operativo y extender el modelo en el futuro (por ejemplo, agregar lecturas o alertas) sin cambiar el esquema base.

---

## 2. ¿Qué validación o restricción consideras más importante en tu solución y por qué?

La validación más importante es la **doble verificación de existencia de entidades referenciadas al crear un monitoreo**: antes de insertar, el servicio confirma que tanto el `sensor_id` como el `zona_id` existen en la base de datos. Si alguno no existe, responde con un `404` claro antes de intentar el INSERT.

La razón es que esta validación protege la **integridad referencial a nivel de aplicación** con mensajes de error útiles. Sin ella, el usuario recibiría un error críptico de constraint de PostgreSQL en lugar de un mensaje que le indique qué ID no existe.

En segundo lugar, los `CHECK` constraints en la base de datos (`tipo IN ('temperatura','presion',...)`  y `estado IN ('ACTIVO','PAUSADO')`) actúan como segunda línea de defensa independiente del código de aplicación. Ambas capas trabajan juntas: la aplicación ofrece mensajes legibles y la base de datos garantiza la integridad incluso ante accesos directos al API de Supabase.

---

## 3. ¿Cómo organizaste la estructura de tu backend y por qué elegiste esa organización?

El backend sigue una **arquitectura de cuatro capas**, una por módulo de dominio (`sensores`, `zonas`, `monitoreos`):

```
Router → Service → Repository → Supabase client
```

- **Routers**: solo declaran los endpoints HTTP, validan los tipos de entrada con Pydantic e inyectan el cliente de base de datos. No contienen lógica.
- **Services**: contienen la lógica de negocio: validaciones de enums, guards de existencia (404), y orquestación de llamadas al repositorio. Es la capa más fácil de testear de forma unitaria.
- **Repositories**: ejecutan las queries REST contra Supabase y devuelven datos crudos. No saben nada del protocolo HTTP ni de las reglas del negocio.
- **Schemas**: modelos Pydantic que describen qué entra y qué sale de cada endpoint, independientes del ORM o del cliente de base de datos.

Elegí esta organización porque **cada capa tiene una única razón para cambiar**: si cambia el proveedor de base de datos, solo toco los repositorios. Si cambia una regla de negocio, solo toco el servicio. Si cambia el contrato HTTP, solo toco el router. Esto también facilita las pruebas, ya que es posible testear la lógica de negocio sin levantar un servidor HTTP.

---

## 4. Si tuvieras un día adicional para mejorar el proyecto, ¿qué funcionalidad o mejora técnica implementarías primero y por qué?

Implementaría **paginación en todos los endpoints de listado** (`GET /sensores/`, `GET /zonas/`, `GET /monitoreos/`) usando parámetros de query estándar (`?page=1&limit=20`).

La razón es pragmática: en un sistema de monitoreo industrial real, la cantidad de registros crece continuamente. Sin paginación, una tabla con miles de monitoreos hace que el endpoint devuelva todos los datos en una sola respuesta, lo que degrada el rendimiento del backend y bloquea el render del frontend. Es la mejora con mayor impacto en escalabilidad con menor esfuerzo de implementación.

Como segunda prioridad, agregaría **autenticación con JWT** para proteger los endpoints de escritura (`POST`, `PATCH`), dado que actualmente cualquier cliente puede modificar el estado de los monitoreos sin ningún tipo de autorización.
