import xModal from "@/plugins/xModal/xModal";
import Swal from "sweetalert2";
interface Button {
  text?: string;
  class?: string;
  click?: Function;
}

interface iMessage {
  title?: string;
  message: string;
  button?: Button;
}

export const message = (config: iMessage) => {
  let { title, message, button } = config;
  let _title = title || "Mensagem do Sistema";
  let id = `modalMessage_${Math.floor(Math.random() * 9999)}`;
  let body = document.querySelector("body");
  let div = document.createElement("div");
  div.setAttribute("id", id);
  div.innerHTML = `
  <div style="height: 100%;display: flex;align-items: center;justify-content: center; font-size: 1.30rem; font-weight: bold;">
    ${message}
  </div>`;
  body.append(div);

  let modal = new xModal.create({
    el: "#" + id,
    title: _title,
    width: 710,
    height: 330,
    onClose() {
      modal.close();
      modal.destroy();
    },
    buttons: {
      Confirmar: {
        html: button != undefined ? button.text : "Confirmar",
        class: button != undefined ? button.class : "",
        click: () => {
          modal.close();
          if (button != undefined && button.click != undefined) {
            button.click();
          }
        },
      },
    },
  });

  modal.open();
};


export const msgConfirm = async (title: string, text: string): Promise<boolean> => {

  let codigo = "" + Math.floor(Math.random() * 999999);

  const { value: codigoConfirm } = await Swal.fire({
    title,
    html: text + " <br><br><b>" + codigo + "</b>",
    input: "text",
    icon: "question",
    inputPlaceholder: "Código",
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: 'Cancelar',
    showLoaderOnConfirm: true,
    inputValidator: (result) => {
      if (result != codigo) return "O código não confere";
      else return;
    },
    didOpen: () => {
      const input = Swal.getInput();
      if (input) {
        input.setAttribute("autocomplete", "off");
      }
    },

  });

  return codigoConfirm != codigo ? false : true
}