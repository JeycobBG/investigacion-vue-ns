
# 📱 Configuración del Entorno para Vue + NativeScript

Este documento describe paso a paso cómo preparar y configurar un entorno de desarrollo para trabajar con **Vue.js** y **NativeScript**, enfocado en desarrollo para Android.

---

## ✅ Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas:

| Herramienta          | Instrucciones                                        |
| -------------------- | ---------------------------------------------------- |
| **Node.js (LTS)**    | [Descargar desde la web oficial](https://nodejs.org) |
| **npm**              | Se instala junto con Node.js                         |
| **NativeScript CLI** | Ejecutar: `npm install -g nativescript`              |

### Verificación de instalación:

```bash
node -v
npm -v
ns --version
```

---

## 📦 Creación del Proyecto

> ⚠️ **Nota:** Este paso no es necesario si el proyecto ya existe.

```bash
ns create nombre-del-proyecto --template @nativescript/template-blank-vue
```

---

## ⚙️ Configuración de Android Studio

1. **Crear un proyecto vacío en Android Studio** (esto permite configurar el emulador utilizando el SDK).

   * Nombre del proyecto: `emulador`
   * Nombre del paquete: `com.moviles.emulator`

2. Abrir **Android Studio > SDK Manager** (desde el menú *Configure* o *Tools > SDK Manager*).

3. **Instalar versiones necesarias del SDK de Android**:

   * En la pestaña **SDK Platforms**:

     * Asegúrate de tener instaladas versiones como API 31, 33 y/o 35.
   * En la pestaña **SDK Tools**:

     * `Android SDK Build-Tools` (ej: 33.0.0)
     * `Android SDK Platform-Tools`
     * `Android SDK Tools`

4. Aplicar los cambios y esperar a que finalice la instalación.

---

## 🛠️ Configuración de Variables de Entorno

### 1. Variable de entorno del sistema:

* `ANDROID_HOME`
  **Valor:** `C:\Users\jeyco\AppData\Local\Android\Sdk`

### 2. Agregar al **PATH**:

```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

---

## 🧪 Verificación del Entorno

Ejecuta el siguiente comando en una terminal con permisos de **administrador**:

```bash
ns doctor
```

> Esto verificará que el entorno esté completamente configurado. Si hay errores, te indicará qué está faltando.

---

## 🚀 Creación y Ejecución del Proyecto

Desde una terminal con permisos de administrador (por ejemplo, en `C:\`):

```bash
ns create vue-ns-moviles --template @nativescript/template-blank-vue
cd vue-ns-moviles
ns run android
```

> Si tienes varios dispositivos/emuladores, puedes listar los disponibles con:

```bash
ns device android --available-devices
```

---

## ☕ Compatibilidad con Java (JDK)

Si al ejecutar el proyecto encuentras errores relacionados con Java, puede deberse a una versión no compatible del JDK.

### Pasos para instalar una versión compatible:

1. Descargar el **JDK 17** desde:
   [https://adoptium.net/en-GB/download/](https://adoptium.net/en-GB/download/)

2. Durante la instalación, **activa** la opción:

   * “Set JAVA\_HOME variable for all users”

3. Actualiza la variable `PATH`:

   * Elimina entradas como:
     `C:\Program Files\Common Files\Oracle\Java\javapath`
   * Añade la ruta correcta hacia el JDK 17 que acabas de instalar.

4. Vuelve a ejecutar:

```bash
ns doctor
```

---

## 💻 Uso de Visual Studio Code

Una vez configurado el entorno correctamente y compilado con éxito desde la terminal como administrador, puedes utilizar la terminal integrada de **Visual Studio Code** para compilar y correr el proyecto.

---

## ⚠️ Consideraciones

* En algunas ocasiones, el equipo puede experimentar **congelamientos** al correr la app.
* Asegúrate de tener el **emulador activo** y la **API en ejecución** antes de compilar.
* Ejecutar como **administrador** puede ser necesario en varias etapas.

---

## 🧾 Referencias

* [Node.js Oficial](https://nodejs.org)
* [NativeScript CLI](https://docs.nativescript.org/)
* [Adoptium JDK Downloads](https://adoptium.net/en-GB/download/)
* [Android Studio SDK Manager](https://developer.android.com/studio/intro)
