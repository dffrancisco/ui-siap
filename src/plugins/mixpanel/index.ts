import mixpanel from "mixpanel-browser";

let tokenProjeto = import.meta.env.VITE_DEV == true ? "e9bbcd77875798f5c0baa240258dcfc0" : "dd530697cdd5031a02748494d21dfd32"

mixpanel.init(tokenProjeto, {
    debug: false, // Habilita logs no console (opcional)
    track_pageview: false, // Rastreia pageviews automaticamente
    persistence: "localStorage", // Armazena os dados do usuário localmente
});

export default mixpanel;
