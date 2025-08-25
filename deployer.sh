#!/bin/sh

dialog --title 'Update Siap' --yesno "\n Gostaria de fazer upload do Siap para a nuvem" 8 60
if [ $? = 0 ]; then

  cp package.json ./ui-siap
  zip -r ./ui-siap.zip ./ui-siap
  cp package.json ui-siap-package.json

  rsync -uahvrztP -e 'ssh -p 2608' --compress-level=5 --progress ./ui-siap.zip ui-siap-package.json root@vyzo.com.br:/home/taap_server

  rm ./ui-siap.zip
  rm ui-siap-package.json

fi
