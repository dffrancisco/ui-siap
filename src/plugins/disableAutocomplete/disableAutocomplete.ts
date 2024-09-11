export default {
    install(app) {
        app.mixin({
            mounted() {
                const inputs = document.querySelectorAll('input');
                inputs.forEach(input => {
                    input.setAttribute('autocomplete', 'off');
                });
            }
        });
    }
}