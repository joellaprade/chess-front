export default function Page() {
  return (
    <div className="mb-20 flex h-full max-w-250 flex-col py-10">
      <h2 className="mt-20">Arquitectura</h2>
      <br />
      <p>
        El frontend de esta aplicación fue programado con Next.js, un framework fullstack que no
        solo facilita la consolidación entre el frontend y backend, pero tambien agiliza el tiempo
        de carga del app por medio de distintos métodos de renderización como renderizado estático,
        dinámico y prerenderizado parcial. Adicionalmente, se utilizó TailwindCSS para estilizar el
        programa.
      </p>
      <br />
      <p>
        El backend fue desarrollado en Node.js utilizando Express como framework. Este fue utilizado
        principalmente para el manejo de WebSockets, al igual que otras funcionalidades como
        búsqueda de jugadores y manejo de archivos.
      </p>
      <br />
      <p>
        El frontend fue desplegado en Vercel, lo cual facilitá el proceso de despliegue dado que
        esta plataforma esta optimizada para proyectos de Next.js. El backend fue desplegado por
        medio de un droplet de DigitalOcean. Para este, fue necesario subir y construir el código
        por medio de Git, instalar Node.js, las dependencias NPM, configurar Nginx como un
        reverse-proxy para redireccionar los fetches y mensages de WebSockets a localhost y
        finalmente, aplicar los certificados necesarios para llevar a cabo las comunicaciones por
        https.
      </p>
      <h2 className="mt-20">Funcionalidades</h2>
      <br />
      <p className="text-light font-bold">Signup</p>
      <p>
        Consta de un form simple que toma los datos del usuario y los envia al backend de Next.js
        por medio de server actions. Al recibir estos datos, el backend envia un correo al usuario
        con un código de verificación, el cual es necesario para activar la cuenta.
      </p>
      <br />
      <p className="text-light font-bold">Login</p>
      <p>
        Similar al signup, consta de un form que manda los datos al backend por medio de server
        actions. Adicionalmente, esta pantalla permite realizar un cambio de contraseña por medio de
        solicitarle al usuario su correo y posteriormente mandando un código de verificación.
      </p>
      <br />
      <p className="text-light font-bold">Inicio</p>
      <p>
        Esta es la página principal de la aplicación y le muestra al usuario las opciones: Jugar
        (contra oponente aleatorio), Amigos y Ajustes
      </p>
      <br />
      <p className="text-light font-bold">Amigos</p>
      <p>
        En esta pantalla, se muestra una lista de las amistades del usuario (y la habilidad de
        solicitar un juego), solicitudes pendientes, y la opción de buscar usuarios para mandar una
        solicitud de amistad. Las nuevas amistades se muestran en tiempo real por medio de
        WebSockets.
      </p>
      <br />
      <p className="text-light font-bold">Invitaciones</p>
      <p>
        La pantalla de invitaciones cuenta un toggle para visualizar tanto las solicitudes de juego
        como las solicitudes de amistad.
      </p>
      <br />
      <p className="text-light font-bold">Agregar Amigo</p>
      <p>
        Esta pantalla permite al usuario agregar un nombre de usuario ya sea completo o parcial, y
        aplica debouncing para limitar la cantidad de peticiones del cliente al servidor. Si el
        usuario destinatario se encuentra en línea al momento de recibir la solicitud de amistad,
        este la podrá visualizar en tiempo real como una notificación.
      </p>
      <br />
      <p className="text-light font-bold">Ajustes</p>
      <p>Simplemente se muestran las opciones Cambiar Foto de Perfil y Cerrar Sessión.</p>
      <br />
      <p className="text-light font-bold">Cambiar Foto de Perfil</p>
      <p>
        En esta pantalla, se muestra un campo para que el usuario suba una foto de perfil. Al hacer
        click en enviar, la imagen se envia al servidor de Express, el cual toma la misma y la sube
        a Cloudninary, un servicio de CDN que facilita el almacenamiento de imagenes y agiliza la
        distribucion de las mismas.
      </p>
      <br />
      <p className="text-light font-bold">Jugar</p>
      <p>
        La pantalla de juego permite a dos jugadores llevar a cabo una partida en vivo haciendo uso
        de WebSockets. Tambien muestra la opción de solicitar una tregua, resignarse y tiene un
        reloj para mostrar el tiempo restante de ambos jugadores. Finalmente, si un usuario se
        desconecta temporalmente y vuelve, el app guarda el tablero, tiempo y turno en localStorage,
        y el backend se encarga de reestablecer la conexión de WebSocket.
      </p>
      <br />
      <p className="text-light font-bold">Notificaciones</p>
      <p>
        A diferencia de las pantallas anteriores, las notificaciones se encuentran presentes en todo
        momento y son activadas por distintos eventos como:
      </p>
      <ul className="list-disc pl-5 text-gray-300">
        <li>Recibir una solicitud de juego/amistad</li>
        <li>Una amistad se conectá/desconectá</li>
        <li>El oponente solicita tregua/otro juego</li>
      </ul>
    </div>
  );
}
