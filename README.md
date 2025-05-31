README CREACION Y CONFIGURACION DEL ENTORNO PARA VUE + NATIVESCRIPT

Asegurarse de tener instalado lo siguiente:
Node (LTS) --> desde la página web
npm    (Viene con node)
nativescript cli --> npm install -g nativescript

Comprobar su instalación
node -v
npm -v
ns --version


Luego para la creación del proyecto (En este caso el proyecto ya existe por lo que todo lo relacionado a la creación no es necesario).
ns create nombre-del-proyecto --template @nativescript/template-blank-vue

Con respecto a la configuración del entorno en adroid studio se debe crear un nuevo proyecto vacio con el fin de utilizar el sdk de android para facilitar el emulador móvil.

nombre del proyecto: emulador.
nombre del paquete: com.moviles.emulator

Abre Android Studio y abre el SDK Manager (está en el menú Configure o en Tools > SDK Manager).

Instalar el SDK de Android necesario, en mi caso se encontraba instalado el API 35, pero además se le instalaron las versiones 33 y 31.
Dentro del SDK Manager:

En la pestaña SDK Platforms, asegúrate de tener instaladas una o varias versiones de Android API (por ejemplo, Android 33 o Android 31).

En la pestaña SDK Tools, asegúrate de que estén instalados:

Android SDK Build-Tools (una versión compatible, por ejemplo 33.0.0 o similar)

Android SDK Platform-Tools

Android SDK Tools

Aplica los cambios y espera a que termine la instalación.

- - - - - - - - - - - - - - - - - - - - - - - 

Tuve que agregar una variable de entirno (sistema) llamada ANDROID_HOME con el path C:\Users\jeyco\AppData\Local\Android\Sdk

 Tamién añadi estas variables al Path (variable de entorno):
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin

No me funcionó cuando abri la terminal desde mi usuario, así que la ejecuté como administrador y realicé el comando ns doctor que funciona para verificar que el entorno está completamente configurado y en caso de un error mostrará lo que haga falta y funcionó.

Luego para la creación del proyecto ejecuté lo siguiente desde la carpeta C: como administrador. ns create vue-ns-moviles --template @nativescript/template-blank-vue

Para correr el proyecto utilicé este comando: ns run android, pero en caso de tener más de un dispositivo este comando tendrá una variación. Para verificar los emuladores disponibles:
Comando para verificar los emuladores: ns device android --available-devices

Al correr el proyecto obtuve un error debido a que la versión de JDK de java que tenía era muy nueva para native script, por eso descargué la versión 17 el kit the desarrollo: https://adoptium.net/en-GB/download/

Me enteré al realizar un ns doctor desde consola.

(Proceso de instalación del JDK compatible)
En las opciones del instalador se debe activar la opción de establecer la variable JAVA_HOME para todos los usuarios.

Luego debí quitar del Path la ruta hacia la versión 23 que tenía instalada: C:\Program Files\Common Files\Oracle\Java\javapath. Y colocar la ruta hacia el JDK que recién instalé.

Después de haberlo corrido desde simbolo del sistema como administrador y tener exito, lo realicé desde la terminal de visual y también se compiló exitosamente.

(Nota: en más de una ocasión mi PC se congeló por completo al ejecutar la app...) También es necesario tener la API corriendo.
